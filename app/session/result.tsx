import { SessionReview } from "@/domain/session/SessionReview"
import { useAppTheme } from "@/theme/ThemeProvider"
import { router, useGlobalSearchParams } from "expo-router"
import { Pressable, StyleSheet, Text, View } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"

export default function SessionReviewScreen() {
  const { review } = useGlobalSearchParams()
  const { theme } = useAppTheme()
  let reviewData: SessionReview | null = null

  try {
    reviewData = review ? JSON.parse(Array.isArray(review) ? review[0] : review) : null
  } catch {
    reviewData = null
  }

  if (!reviewData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Animated.View
          entering={FadeInDown.springify().damping(18)}
          style={[styles.emptyCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
        >
          <Text style={[styles.emptyEyebrow, { color: theme.warning }]}>Session review unavailable</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>No completed session data was found.</Text>
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>
            This screen only appears after a session ends successfully.
          </Text>
          <Pressable style={[styles.button, { backgroundColor: theme.accent }]} onPress={() => router.replace("/(tabs)/home")}>
            <Text style={[styles.buttonText, { color: theme.accentText }]}>Back to Home</Text>
          </Pressable>
        </Animated.View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.glowOne, { backgroundColor: theme.coolGlow }]} />
      <View style={[styles.glowTwo, { backgroundColor: theme.warmGlow }]} />

      <Animated.View entering={FadeInDown.springify().damping(18)} style={styles.hero}>
        <Text style={[styles.eyebrow, { color: theme.success }]}>Session complete</Text>
        <Text style={[styles.title, { color: theme.text }]}>Nice run.</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Your score is saved. Review the session stats, then head back for another round.
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(120).springify().damping(18)}
        style={[styles.stats, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
      >
        <Stat label="Completed" value={reviewData.completedNum} color={theme.text} soft={theme.textSoft} />
        <Stat label="Incorrect" value={reviewData.incorrectNum} color={theme.text} soft={theme.textSoft} />
        <Stat label="Longest Streak" value={reviewData.longestStreak} color={theme.text} soft={theme.textSoft} />
        <Stat label="XP Gained" value={reviewData.gainedXp} color={theme.text} soft={theme.textSoft} />
      </Animated.View>

      {reviewData.leveledUp && (
        <Animated.View
          entering={FadeInDown.delay(220).springify().damping(18)}
          style={[styles.levelUpCard, { backgroundColor: theme.successSoft }]}
        >
          <Text style={[styles.levelUp, { color: theme.success }]}>Level up unlocked</Text>
          <Text style={[styles.levelUpText, { color: theme.textMuted }]}>
            Your account advanced to the next level after this session.
          </Text>
        </Animated.View>
      )}

      <Pressable style={[styles.button, { backgroundColor: theme.accent }]} onPress={() => router.replace("/(tabs)/home")}>
        <Text style={[styles.buttonText, { color: theme.accentText }]}>Back to Home</Text>
      </Pressable>
    </View>
  )
}

function Stat({
  label,
  value,
  color,
  soft,
}: {
  label: string
  value: number
  color: string
  soft: string
}) {
  return (
    <View style={styles.statRow}>
      <Text style={[styles.statLabel, { color: soft }]}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: "center",
  },
  glowOne: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 999,
    opacity: 0.16,
    top: -60,
    right: -60,
  },
  glowTwo: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 999,
    opacity: 0.16,
    bottom: -100,
    left: -90,
  },
  hero: {
    marginBottom: 22,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.7,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  stats: {
    borderRadius: 28,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
  },
  levelUpCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
  },
  levelUp: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  levelUpText: {
    lineHeight: 20,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 18,
  },
  buttonText: {
    fontWeight: "800",
    textAlign: "center",
    fontSize: 18,
  },
  emptyCard: {
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
  },
  emptyEyebrow: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },
})
