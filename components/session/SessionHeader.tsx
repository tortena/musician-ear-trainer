import { View, Text, StyleSheet } from "react-native"

export function SessionHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.text}>🔥 3</Text>
      <Text style={styles.text}>✔ 5</Text>
      <Text style={styles.text}>✖ 1</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  text: {
    color: "#9CA3AF",
    fontWeight: "600",
  },
})
