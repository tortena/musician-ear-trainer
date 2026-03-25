
import { SkillComponentId } from '@/constants'
import { getSkillTypeFromComponent } from '@/utils/hierarchy'
import { Audio } from 'expo-av'
import { match } from "ts-pattern"
import { audioMap } from './audioMap'

let soundObject: Audio.Sound | null = null
let isPlaying = false
let playbackTimeout: ReturnType<typeof setTimeout> | null = null

const placeholderAudio = require('@/assets/audio/placeholder.mp3')


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

export async function playSkillComponentAudio(skillComponentId: SkillComponentId, randomise: boolean) {
  if (!skillComponentId) {
    console.error("Invalid skillComponentId: undefined or empty")
    return
  }

  try {
    const skillTypeId = getSkillTypeFromComponent(skillComponentId)
    const notePreference = randomise ? NOTES[Math.floor(Math.random()*NOTES.length)] : NOTES[0]

    match(skillTypeId)
      .with("notes", () => {
        const note = skillComponentId.slice(5)
        playAudio(note + note)
      })
      .with("chords", () => playAudio(skillComponentId + notePreference))
      .with("intervals", () => {
        const key = selectIntervalVariant(skillComponentId, notePreference)
        playAudio(key)
      })
      .exhaustive()
  } catch (error) {
    console.error(`Failed to play audio for skillComponentId "${skillComponentId}":`, error)
  }
}

/**
 * Select a random interval variant (down, harmonic, up) and return the key
 */
function selectIntervalVariant(skillComponentId: string, notePreference: string): string {
  // Extract the base name (e.g., "Aug13" from "Aug13_down")
  const baseName = skillComponentId.split('_')[0]
  const variants = ["down", "harmonic", "up"]
  const randomVariant = variants[Math.floor(Math.random() * variants.length)]
  return `${baseName}_${randomVariant}${notePreference}`
}

/**
 * Play an audio file given a flashcard key
 */
async function playAudio(key: string) {
  if (isPlaying) return
  isPlaying = true

  console.log(`playAudio called with key: "${key}"`)

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

    let asset = audioMap[key]

    if (!asset) {
      console.warn(`Audio not found for key "${key}", using placeholder`)
      asset = placeholderAudio
    } else {
      // Validate that the asset is actually a valid require result
      if (typeof asset !== 'number' && !asset) {
        console.warn(`Audio asset for key "${key}" is invalid (null/undefined), using placeholder`)
        asset = placeholderAudio
      }
    }

    const { sound } = await Audio.Sound.createAsync(
      asset,
      { shouldPlay: true }
    )

    soundObject = sound

    // Unlock when playback finishes
    sound.setOnPlaybackStatusUpdate(status => {
      if (!status.isLoaded) return
      if (status.didJustFinish) {
        resetPlayingState()
      }
    })

  } catch (error) {
    console.error(`Audio playback error for key "${key}":`, error)

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
  resetPlayingState()
  if (soundObject) {
    await soundObject.stopAsync()
    await soundObject.unloadAsync()
    soundObject = null
  }
}
