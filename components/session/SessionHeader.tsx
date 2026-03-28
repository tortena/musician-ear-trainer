import { StyleSheet, Text, View } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { useAppTheme } from "@/theme/ThemeProvider"
import { Check, Flame, X } from "lucide-react-native"
import type { ReactNode } from "react"

interface SessionHeaderProps {
  streak: number
  correctNum: number
  incorrectNum: number
  questionsLeft: number
}

export function SessionHeader({ streak, correctNum, incorrectNum, questionsLeft }: SessionHeaderProps) {
  const { theme } = useAppTheme()

  return (
    <Animated.View entering={FadeInDown.springify().damping(18)} style={styles.header}>
      <StatPill
        icon={<Flame color={theme.accent} size={15} />}
        value={streak}
        tone="warm"
        theme={theme}
      />
      <StatPill
        icon={<Check color={theme.success} size={15} />}
        value={correctNum}
        tone="good"
        theme={theme}
      />
      <StatPill
        icon={<X color={theme.danger} size={15} />}
        value={incorrectNum}
        tone="bad"
        theme={theme}
      />
    </Animated.View>
  )
}

function StatPill({
  icon,
  value,
  tone,
  theme,
}: {
  icon: ReactNode
  value: number
  tone: "warm" | "good" | "bad"
  theme: ReturnType<typeof useAppTheme>["theme"]
}) {
  const toneStyle = {
    warm: { backgroundColor: theme.accentSoft, borderColor: theme.accent },
    good: { backgroundColor: theme.successSoft, borderColor: theme.success },
    bad: { backgroundColor: theme.dangerSoft, borderColor: theme.danger },
  }[tone]

  return (
    <View style={[styles.pill, toneStyle]}>
      <View style={styles.row}>
        {icon}
        <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 18,
    gap: 8,
  },
  pill: {
    minWidth: 74,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  value: {
    fontWeight: "800",
    fontSize: 16,
  },
})
