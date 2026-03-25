// app/(tabs)/home.tsx
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { UserProgress } from "@/domain/progression/UserProgress";
import { getXpForLevel } from "@/logic/progression"; // imaginary import
import { loadUserProgress } from "@/storage/userProgress";
import { isSameDay } from "@/utils/dates";

export default function HomeScreen() {
  const [progress, setProgress] = useState<UserProgress | null>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const p = await loadUserProgress()
    setProgress(p)
  }

  if (!progress) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading…</Text>
      </View>
    )
  }

  const { xp, level } = progress.progression
  const { currentStreak, longestStreak, lastActiveDate } =
    progress.engagement

  const xpForNextLevel = getXpForLevel(level + 1)
  const xpForCurrentLevel = getXpForLevel(level)

  const progressRatio =
    (xp - xpForCurrentLevel) /
    (xpForNextLevel - xpForCurrentLevel)

  const completedToday = isSameDay(
    new Date(lastActiveDate),
    new Date()
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>

      {/* Level */}
      <Text style={styles.levelText}>Level {level}</Text>

      {/* XP Bar */}
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${Math.min(progressRatio * 100, 100)}%` },
          ]}
        />
      </View>

      <Text style={styles.xpText}>
        {xp} / {xpForNextLevel} XP
      </Text>

      {/* Streaks */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔥 Streaks</Text>
        <Text style={styles.cardText}>
          Current streak: {currentStreak}
        </Text>
        <Text style={styles.cardText}>
          Longest streak: {longestStreak}
        </Text>
      </View>

      {/* Today */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📅 Today</Text>
        <Text
          style={[
            styles.cardText,
            completedToday ? styles.good : styles.bad,
          ]}
        >
          {completedToday
            ? "Session completed 🎉"
            : "No session yet"}
        </Text>
      </View>
    </View>
  )
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0B14",
    padding: 24,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },
  levelText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 14,
    width: "100%",
    backgroundColor: "#2A2438",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#8B5CF6",
  },
  xpText: {
    color: "#B3B3B3",
    marginTop: 8,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#181421",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  cardText: {
    color: "#D1D5DB",
    fontSize: 14,
  },
  good: {
    color: "#34D399",
    fontWeight: "600",
  },
  bad: {
    color: "#F87171",
    fontWeight: "600",
  },
})

