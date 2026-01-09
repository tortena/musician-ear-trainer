// app/(tabs)/start.tsx
import { View, Text, Pressable, StyleSheet } from "react-native"
import { router } from "expo-router"

export default function StartScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ready to train?</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("./session")}
      >
        <Text style={styles.buttonText}>Start Session</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0B14",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})
