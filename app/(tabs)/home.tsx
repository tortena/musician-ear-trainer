import { useFocusEffect } from "expo-router"
import { Sparkles, Flame, CircleCheckBig } from "lucide-react-native"
import { useCallback, useState } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"

import { UserProgress } from "@/domain/progression/UserProgress"
import { getXpForLevel } from "@/logic/progression"
import { loadUserProgress } from "@/storage/userProgress"
import { useAppTheme } from "@/theme/ThemeProvider"
import { isSameDay, isYesterday, parseStoredDate } from "@/utils/dates"

export default function HomeScreen() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const { theme } = useAppTheme()

  useFocusEffect(
    useCallback(() => {
      load()
    }, [])
  )

  async function load() {
    const p = await loadUserProgress()
    setProgress(p)
  }

  if (!progress) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.text }]}>Loading…</Text>
      </View>
    )
  }

  const { xp, level } = progress.progression
  const { currentStreak, longestStreak, lastActiveDate } = progress.engagement

  const xpForNextLevel = getXpForLevel(level + 1)
  const xpForCurrentLevel = getXpForLevel(level)
  const progressRatio = (xp - xpForCurrentLevel) / Math.max(1, xpForNextLevel - xpForCurrentLevel)

  const today = new Date()
  const lastActive = parseStoredDate(lastActiveDate)
  const completedToday = lastActive ? isSameDay(lastActive, today) : false
  const activeStreak =
    lastActive && (isSameDay(lastActive, today) || isYesterday(lastActive, today))
      ? currentStreak
      : 0
  const levelProgressLabel = `${Math.max(0, xp - xpForCurrentLevel)} / ${Math.max(1, xpForNextLevel - xpForCurrentLevel)} XP`

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.glowOne, { backgroundColor: theme.warmGlow }]} />
      <View style={[styles.glowTwo, { backgroundColor: theme.coolGlow }]} />

      <Animated.View
        entering={FadeInDown.springify().damping(18)}
        style={[styles.hero, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
      >
        <View style={[styles.heroBadge, { backgroundColor: theme.accentSoft }]}>
          <Sparkles color={theme.text} size={14} />
          <Text style={[styles.heroBadgeText, { color: theme.text }]}>Daily ear training</Text>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>Progress that actually moves.</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Track real sessions, your current streak, and how close you are to the next level.
        </Text>

        <View style={styles.levelRow}>
          <View>
            <Text style={[styles.levelLabel, { color: theme.textSoft }]}>Current level</Text>
            <Text style={[styles.levelText, { color: theme.text }]}>Level {level}</Text>
          </View>
          <View style={[styles.levelPill, { backgroundColor: theme.accent }]}>
            <Text style={[styles.levelPillText, { color: theme.accentText }]}>{xp} XP</Text>
          </View>
        </View>

        <View style={[styles.progressBarBackground, { backgroundColor: theme.progressTrack }]}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(Math.max(progressRatio, 0) * 100, 100)}%`, backgroundColor: theme.progressFill },
            ]}
          />
        </View>

        <Text style={[styles.xpText, { color: theme.textSoft }]}>{levelProgressLabel} to next level</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).springify().damping(18)} style={styles.statsGrid}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeader}>
            <Flame color={theme.accent} size={18} />
            <Text style={[styles.cardTitle, { color: theme.text }]}>Streak</Text>
          </View>
          <Text style={[styles.metricValue, { color: theme.text }]}>{activeStreak}</Text>
          <Text style={[styles.cardText, { color: theme.textMuted }]}>Current active streak</Text>
          <Text style={[styles.secondaryText, { color: theme.textSoft }]}>Best run: {longestStreak} days</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeader}>
            <CircleCheckBig color={completedToday ? theme.success : theme.warning} size={18} />
            <Text style={[styles.cardTitle, { color: theme.text }]}>Today</Text>
          </View>
          <Text style={[styles.statusValue, { color: completedToday ? theme.success : theme.danger }]}>
            {completedToday ? "Complete" : "Pending"}
          </Text>
          <Text style={[styles.cardText, { color: theme.textMuted }]}>
            {completedToday ? "You have already trained today." : "Your next session is still open."}
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(220).springify().damping(18)}
        style={[styles.summaryCard, { backgroundColor: theme.surfaceAlt }]}
      >
        <Text style={[styles.summaryEyebrow, { color: theme.success }]}>Momentum</Text>
        <Text style={[styles.summaryTitle, { color: theme.text }]}>Consistency wins.</Text>
        <Text style={[styles.summaryText, { color: theme.textMuted }]}>
          The Home tab only keeps your current streak active if you trained today or yesterday.
        </Text>
      </Animated.View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 18,
    minHeight: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 22,
    fontWeight: "700",
  },
  glowOne: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 999,
    opacity: 0.18,
    top: -80,
    right: -80,
  },
  glowTwo: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    opacity: 0.16,
    bottom: 40,
    left: -90,
  },
  hero: {
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 22,
  },
  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  levelLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  levelText: {
    fontSize: 28,
    fontWeight: "800",
  },
  levelPill: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  levelPillText: {
    fontWeight: "800",
  },
  progressBarBackground: {
    height: 14,
    width: "100%",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
  },
  xpText: {
    marginTop: 8,
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 14,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  metricValue: {
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 6,
  },
  statusValue: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
  },
  secondaryText: {
    fontSize: 13,
    marginTop: 8,
  },
  summaryCard: {
    borderRadius: 28,
    padding: 22,
    marginTop: 4,
  },
  summaryEyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.7,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
  },
})
