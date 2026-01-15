
import { Audio } from 'expo-av'

let soundObject: Audio.Sound | null = null
let isPlaying = false
let playbackTimeout: ReturnType<typeof setTimeout> | null = null

const placeholderAudio = require('../assets/audio/placeholder.mp3')

const audioMap: Record<string, number> = {
  'intervals/m2_up': placeholderAudio,
  'intervals/m2_down': placeholderAudio,
  'intervals/m2_harmonic': placeholderAudio,
}

/**
 * Reset the playing flag and cleanup timeout
 */
function resetPlayingState() {
  isPlaying = false
  if (playbackTimeout) {
    clearTimeout(playbackTimeout)
    playbackTimeout = null
  }
}

/**
 * Play an audio file given a flashcard key
 */
export async function playAudio(key: string) {
  if (isPlaying) return
  isPlaying = true

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

    // Normalize key (optional but recommended)
    const normalizedKey = key.replace(/^audio\//, '')

    let asset = audioMap[normalizedKey]

    if (!asset) {
      console.warn(`Audio not found for "${key}", using placeholder`)
      asset = placeholderAudio
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
    console.error('Audio error, forcing placeholder:', error)

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
