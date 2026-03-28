import { SKILL_MODES } from "@/constants"
import { isSkillModeUnlocked } from "@/logic/progression"
import { loadUserProgress } from "@/storage/userProgress"
import { useAppTheme } from "@/theme/ThemeProvider"
import { router, useFocusEffect } from "expo-router"
import { Pressable, StyleSheet, Text, View } from "react-native"
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"
import { useCallback, useEffect, useState } from "react"

const FLOWER_ROW_WIDTH = 720
const FLOWER_COUNT = 10
const START_SCREEN_PADDING = 24

function BackgroundFlowerRow({
  direction,
  top,
  opacity,
  theme,
}: {
  direction: "left" | "right"
  top: number
  opacity: number
  theme: ReturnType<typeof useAppTheme>["theme"]
}) {
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 28000,
        easing: Easing.linear,
      }),
      -1,
      false
    )
  }, [progress])

  const animatedStyle = useAnimatedStyle(() => {
    const distance = 220
    const offset = direction === "left" ? -progress.value * distance : progress.value * distance

    return {
      transform: [{ translateX: offset }],
    }
  })

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.flowerRow,
        {
          top,
          opacity,
        },
        animatedStyle,
      ]}
    >
      {Array.from({ length: FLOWER_COUNT }).map((_, index) => (
        <View
          key={`${direction}-${index}`}
          style={[
            styles.flowerWrap,
            {
              marginLeft: index === 0 ? 0 : 18,
              transform: [{ rotate: `${index % 2 === 0 ? 8 : -10}deg` }],
            },
          ]}
        >
          <View
            style={[
              styles.flowerPetal,
              styles.flowerPetalTop,
              { borderColor: theme.cardBorder, backgroundColor: theme.mode === "dark" ? "#203128" : "#EEF6E8" },
            ]}
          />
          <View
            style={[
              styles.flowerPetal,
              styles.flowerPetalRight,
              { borderColor: theme.cardBorder, backgroundColor: theme.mode === "dark" ? "#203128" : "#EEF6E8" },
            ]}
          />
          <View
            style={[
              styles.flowerPetal,
              styles.flowerPetalBottom,
              { borderColor: theme.cardBorder, backgroundColor: theme.mode === "dark" ? "#203128" : "#EEF6E8" },
            ]}
          />
          <View
            style={[
              styles.flowerPetal,
              styles.flowerPetalLeft,
              { borderColor: theme.cardBorder, backgroundColor: theme.mode === "dark" ? "#203128" : "#EEF6E8" },
            ]}
          />
          <View
            style={[
              styles.flowerCenter,
              { backgroundColor: theme.mode === "dark" ? "#A98033" : "#E7BE62", borderColor: theme.cardBorder },
            ]}
          />
        </View>
      ))}
    </Animated.View>
  )
}

export default function StartScreen() {
  const { theme } = useAppTheme()
  const [summary, setSummary] = useState<string[]>([])

  const load = useCallback(async () => {
    const progress = await loadUserProgress()
    const unlockedModes = Object.values(SKILL_MODES)
      .filter((mode) => isSkillModeUnlocked(progress, mode.id))
      .slice(0, 3)
      .map((mode) => mode.title)

    setSummary(unlockedModes)
  }, [])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load])
  )

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.glowOne, { backgroundColor: theme.coolGlow }]} />
      <View style={[styles.glowTwo, { backgroundColor: theme.warmGlow }]} />
      <BackgroundFlowerRow direction="left" top={84} opacity={0.24} theme={theme} />
      <BackgroundFlowerRow direction="right" top={520} opacity={0.2} theme={theme} />

      <Animated.View
        entering={FadeInDown.springify().damping(18)}
        style={[styles.hero, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
      >
        <Text style={[styles.eyebrow, { color: theme.success }]}>Focused listening</Text>
        <Text style={[styles.title, { color: theme.text }]}>Ready for a quick streak run?</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          A mixed session will pull from your unlocked tracks and due cards.
        </Text>

        <View style={styles.summaryWrap}>
          <Text style={[styles.summaryLabel, { color: theme.textSoft }]}>This session may include</Text>
          <View style={styles.summaryRow}>
            {summary.length > 0 ? (
              summary.map((mode) => (
                <View key={mode} style={[styles.summaryChip, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                  <Text style={[styles.summaryChipText, { color: theme.text }]}>{mode}</Text>
                </View>
              ))
            ) : (
              <Text style={[styles.summaryFallback, { color: theme.textSoft }]}>Unlock a track from Skills to start building sessions.</Text>
            )}
          </View>
        </View>

        <Pressable
          style={[styles.button, { backgroundColor: theme.accent }]}
          onPress={() => router.push("/session")}
        >
          <Text style={[styles.buttonText, { color: theme.accentText }]}>Start Session</Text>
        </Pressable>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: START_SCREEN_PADDING,
    justifyContent: "center",
    overflow: "hidden",
  },
  glowOne: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 999,
    opacity: 0.18,
    top: -70,
    right: -70,
  },
  glowTwo: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 999,
    opacity: 0.14,
    bottom: -80,
    left: -80,
  },
  flowerRow: {
    position: "absolute",
    left: -140,
    width: FLOWER_ROW_WIDTH,
    flexDirection: "row",
    alignItems: "center",
  },
  flowerWrap: {
    width: 46,
    height: 46,
    position: "relative",
  },
  flowerPetal: {
    position: "absolute",
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 1,
  },
  flowerPetalTop: {
    top: 0,
    left: 12,
  },
  flowerPetalRight: {
    top: 12,
    right: 0,
  },
  flowerPetalBottom: {
    bottom: 0,
    left: 12,
  },
  flowerPetalLeft: {
    top: 12,
    left: 0,
  },
  flowerCenter: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 999,
    top: 15,
    left: 15,
    borderWidth: 1,
  },
  hero: {
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
  },
  eyebrow: {
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.7,
    marginBottom: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  summaryWrap: {
    marginBottom: 18,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  summaryChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  summaryChipText: {
    fontWeight: "700",
    fontSize: 12,
  },
  summaryFallback: {
    fontSize: 13,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 18,
    alignSelf: "flex-start",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
})
