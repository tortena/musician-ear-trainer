
import { SkillComponentId } from '@/constants'
import { Asset } from 'expo-asset'
import { getSkillTypeFromComponent } from '@/utils/hierarchy'
import { Audio, AVPlaybackSource } from 'expo-av'
import { Platform } from 'react-native'
import { match } from "ts-pattern"
import { audioMap } from './audioMap'

let soundObject: Audio.Sound | null = null
let isPlaying = false
let playbackTimeout: ReturnType<typeof setTimeout> | null = null

const placeholderAudio = require('@/assets/audio/placeholder.mp3')
type AudioModule = number | string | { uri?: string; type?: string }


/**
 * Reset the playing flag and cleanup timeout
 */
function resetPlayingState() {
  isPlaying = false
  if (playbackTimeout) {
    clearTimeout(playbackTimeout)
    playbackTimeout = null
  }
  // Clean up stale sound reference to prevent reuse issues
  soundObject = null
}

const NOTES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
const INTERVAL_VARIANTS = ["down", "harmonic", "up"] as const

export async function playSkillComponentAudio(skillComponentId: SkillComponentId, randomise: boolean) {
  if (!skillComponentId) {
    console.error("Invalid skillComponentId: undefined or empty")
    return
  }

  try {
    const skillTypeId = getSkillTypeFromComponent(skillComponentId)
    const candidateKeys = match(skillTypeId)
      .with("notes", () => {
        const note = skillComponentId.slice(5)
        return [note + note]
      })
      .with("chords", () => buildChordCandidateKeys(skillComponentId, randomise))
      .with("intervals", () => buildIntervalCandidateKeys(skillComponentId, randomise))
      .exhaustive()

    await playAudio(candidateKeys, skillComponentId)
  } catch (error) {
    console.error(`Failed to play audio for skillComponentId "${skillComponentId}":`, error)
  }
}

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items]

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }

  return copy
}

function buildChordCandidateKeys(skillComponentId: string, randomise: boolean): string[] {
  const noteOrder = randomise ? shuffle(NOTES) : [...NOTES]
  return noteOrder.map((note) => `${skillComponentId}${note}`)
}

function buildIntervalCandidateKeys(skillComponentId: string, randomise: boolean): string[] {
  const baseName = skillComponentId.split('_')[0]
  const noteOrder = randomise ? shuffle(NOTES) : [...NOTES]
  const requestedVariant = skillComponentId.split("_")[1] as (typeof INTERVAL_VARIANTS)[number] | undefined
  const variantOrder = [
    ...(requestedVariant ? [requestedVariant] : []),
    ...shuffle(INTERVAL_VARIANTS.filter((variant) => variant !== requestedVariant)),
  ]

  return variantOrder.flatMap((variant) =>
    noteOrder.map((note) => `${baseName}_${variant}${note}`)
  )
}

function resolveAudioAssets(candidateKeys: string[]) {
  const resolvedAssets: { asset: AudioModule; resolvedKey: string }[] = []

  for (const key of candidateKeys) {
    const asset = audioMap[key] as AudioModule | undefined
    if (asset !== null && asset !== undefined) {
      resolvedAssets.push({ asset, resolvedKey: key })
    }
  }

  return resolvedAssets
}

function appendMissingExtension(uri: string, extension: string): string {
  const [path, query = ""] = uri.split("?")
  if (/\.[a-z0-9]+$/i.test(path)) {
    return uri
  }

  const suffix = query ? `?${query}` : ""
  return `${path}.${extension}${suffix}`
}

function normaliseWebAssetUri(uri: string, type?: string): string {
  const extension = typeof type === "string" && type.length > 0 ? type : "mp3"
  const withExtension = appendMissingExtension(uri, extension)
  const [path, query = ""] = uri.split("?")
  const encodedPath = path.replaceAll("#", "%23")
  return query ? `${encodedPath}?${query}` : encodedPath
}

function getPlaybackSource(asset: AudioModule): AVPlaybackSource {
  if (typeof asset === "string") {
    return { uri: normaliseWebAssetUri(asset) }
  }

  if (typeof asset === "number") {
    if (Platform.OS !== "web") {
      return asset
    }

    const moduleAsset = Asset.fromModule(asset)
    const sourceUri = moduleAsset.localUri ?? moduleAsset.uri
    if (typeof sourceUri !== "string") {
      return asset
    }

    return { uri: normaliseWebAssetUri(sourceUri, moduleAsset.type) }
  }

  if (typeof asset !== "object" || asset === null || typeof asset.uri !== "string") {
    return placeholderAudio
  }

  if (Platform.OS !== "web") {
    return { uri: asset.uri }
  }

  return { uri: normaliseWebAssetUri(asset.uri, asset.type) }
}

async function playAudio(candidateKeys: string[], skillComponentId: SkillComponentId) {
  if (isPlaying) return
  isPlaying = true
  let resolvedKey: string | null = null
  const candidatePreview = candidateKeys.slice(0, 5)

  // Timeout fallback: reset flag after 10 seconds max
  playbackTimeout = setTimeout(() => {
    resetPlayingState()
  }, 10000)

  try {
    // Clean up previous sound
    if (soundObject) {
      await soundObject.unloadAsync()
      soundObject = null
    }

    const resolvedAssets = resolveAudioAssets(candidateKeys)

    if (resolvedAssets.length === 0) {
      console.warn(
        `[audio] placeholder fallback for "${skillComponentId}". Tried ${candidateKeys.length} candidate keys:`,
        candidatePreview
      )
      const { sound } = await Audio.Sound.createAsync(placeholderAudio, { shouldPlay: true })
      soundObject = sound
    } else {
      let playbackError: unknown = null

      for (const candidate of resolvedAssets) {
        try {
          resolvedKey = candidate.resolvedKey
          console.info(`[audio] playing "${skillComponentId}" via asset key "${resolvedKey}"`)

          const { sound } = await Audio.Sound.createAsync(
            getPlaybackSource(candidate.asset),
            { shouldPlay: true }
          )

          soundObject = sound
          playbackError = null
          break
        } catch (error) {
          playbackError = error
          console.warn(`[audio] failed asset key "${candidate.resolvedKey}" for "${skillComponentId}"`, error)
        }
      }

      if (!soundObject) {
        throw playbackError ?? new Error(`No playable audio asset found for "${skillComponentId}"`)
      }
    }

    soundObject?.setOnPlaybackStatusUpdate(status => {
      if (!status.isLoaded) return
      if (status.didJustFinish) {
        resetPlayingState()
      }
    })

  } catch (error) {
    console.error(
      `Audio playback error for skill component "${skillComponentId}"${resolvedKey ? ` (resolved key "${resolvedKey}")` : ""}:`,
      error
    )

    // 🔒 Absolute last-resort fallback
    try {
      const { sound } = await Audio.Sound.createAsync(
        placeholderAudio,
        { shouldPlay: true }
      )
      soundObject = sound

      // Also set playback status for fallback
      sound.setOnPlaybackStatusUpdate(status => {
        if (!status.isLoaded) return
        if (status.didJustFinish) {
          resetPlayingState()
        }
      })

    } catch (e) {
      console.error('Placeholder ALSO failed 😬', e)
      resetPlayingState()
    }
  }
}

export async function stopAudio() {
  const activeSound = soundObject
  resetPlayingState()
  if (activeSound) {
    await activeSound.stopAsync()
    await activeSound.unloadAsync()
  }
}
