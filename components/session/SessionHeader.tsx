import { StyleSheet, Text, View } from "react-native"

interface SessionHeaderProps {
  streak: number
  correctNum: number
  incorrectNum: number
  questionsLeft: number
}

export function SessionHeader({ streak, correctNum, incorrectNum, questionsLeft }: SessionHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.text}>🔥 {streak}</Text>
      <Text style={styles.text}>✔ {correctNum}</Text>
      <Text style={styles.text}>✖ {incorrectNum}</Text>
      <Text style={styles.text}>📋 {questionsLeft}</Text>
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
