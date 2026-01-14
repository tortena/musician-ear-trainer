
// audioPlayer.ts
import { Audio } from 'expo-av'
import { Asset } from 'expo-asset'

let soundObject: Audio.Sound | null = null

// Placeholder audio file for testing
const placeholderAudio = require('../assets/audio/placeholder.mp3')


const audioMap: Record<string, any> = {
  'intervals/ascending/C_M3': placeholderAudio,
  'intervals/descending/C_M3': placeholderAudio,
  'intervals/harmonic/C_M3': placeholderAudio,
  'chords/maj7/C': placeholderAudio,
  
}

/**
 * Play an audio file given a flashcard key
 * @param key string representing the audio to play, e.g. 'intervals/ascending/C_M3'
 */

let isPlaying = false

export async function playAudio(key: string) {
  if (isPlaying) return
  isPlaying = true

  try {
    // Unload previous sound
    if (soundObject) {
      await soundObject.unloadAsync()
      soundObject = null
    }

    // Load the asset dynamically from the map
    const assetModule = audioMap[key] ?? placeholderAudio

    const { sound } = await Audio.Sound.createAsync(assetModule)
    soundObject = sound

    await sound.playAsync()
  } catch (error) {
    console.error('Error playing audio:', error)
  } finally {
    isPlaying = false
  }
}


//Stop current audio playback

export async function stopAudio() {
  if (soundObject) {
    await soundObject.stopAsync()
    await soundObject.unloadAsync()
    soundObject = null
  }
}

/*
// Play a flashcard audio
await playAudio('intervals/ascending/C_M3')

// Stop if user skips
await stopAudio()
*/
