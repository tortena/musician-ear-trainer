// storage/resetStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage"

export async function resetAllStorage() {
  await AsyncStorage.clear()
  console.log("🧹 AsyncStorage cleared")
}
