// audioPlayer.ts
import { Audio } from 'expo-av'
import { Asset } from 'expo-asset'

let soundObject: Audio.Sound | null = null

// Placeholder audio file for testing
const placeholderAudio = require('../assets/audio/placeholder.mp3')

/**
 * Map flashcard IDs / paths to actual assets
 * For now, everything points to the placeholder
 * Later, replace with real assets
 */
const audioMap: Record<string, any> = {
  'intervals/ascending/C_M3': placeholderAudio,
  'intervals/descending/C_M3': placeholderAudio,
  'intervals/harmonic/C_M3': placeholderAudio,
  'chords/maj7/C': placeholderAudio,
  // ...add all IDs / paths you plan to support
}

/**
 * Play an audio file given a flashcard key
 * @param key string representing the audio to play, e.g. 'intervals/ascending/C_M3'
 */
export async function playAudio(key: string) {
  try {
    // Unload previous sound
    if (soundObject) {
      await soundObject.unloadAsync()
      soundObject = null
    }

    // Load the asset dynamically from the map
    const assetModule = audioMap[key] ?? placeholderAudio
    const asset = Asset.fromModule(assetModule)
    await asset.downloadAsync() // ensure it's loaded

    const { sound } = await Audio.Sound.createAsync(asset)
    soundObject = sound

    await sound.playAsync()
  } catch (error) {
    console.error('Error playing audio:', error)
  }
}

/**
 * Stop current audio playback
 */
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
