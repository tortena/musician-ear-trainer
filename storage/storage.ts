import AsyncStorage from "@react-native-async-storage/async-storage";

export enum StorageKey {
    USER_PROGRESS = "user_progress"
}

export async function saveData<T>(key: StorageKey, data: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(data))
}

export async function loadData<T>(key: StorageKey): Promise<T | null> {
    const raw = await AsyncStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
}

export async function removeData(key: StorageKey): Promise<void> {
  await AsyncStorage.removeItem(key);
}