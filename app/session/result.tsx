import { View, Text, Pressable, StyleSheet } from "react-native"
import { router, useGlobalSearchParams } from "expo-router"

import { SessionReview } from "@/domain/session/SessionReview"

// ---- DUMMY REVIEW (replace with real from sessionController) ----
const dummyReview: SessionReview = {
  completedNum: 12,
  incorrectNum: 3,
  longestStreak: 7,
  gainedXp: 40,
  leveledUp: true,
}

const { paramReview } = useGlobalSearchParams()



export default function SessionReviewScreen() {
  
  let review
  try {
    review = 
      paramReview ? JSON.parse(Array.isArray(paramReview) ? paramReview[0] : paramReview) : dummyReview
  } catch {
    review = dummyReview
  }

  const r = review

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session Complete!</Text>

      <View style={styles.stats}>
        <Stat label="Completed" value={r.completedNum} />
        <Stat label="Incorrect" value={r.incorrectNum} />
        <Stat label="Longest Streak" value={r.longestStreak} />
        <Stat label="XP Gained" value={r.gainedXp} />
        {r.leveledUp && <Text style={styles.levelUp}>🎉 Level Up!</Text>}
      </View>

      <Pressable
        style={styles.button}
        onPress={() => router.replace("../(tabs)/home")}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </Pressable>
    </View>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0B14",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#8B5CF6",
    textAlign: "center",
    marginBottom: 32,
  },
  stats: {
    marginBottom: 48,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  statLabel: {
    color: "#9CA3AF",
    fontSize: 18,
    fontWeight: "600",
  },
  statValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  levelUp: {
    textAlign: "center",
    color: "#22C55E",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 12,
  },
  button: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 14,
    borderRadius: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 18,
  },
})
