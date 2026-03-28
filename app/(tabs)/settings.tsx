import type { ReactNode } from "react"
import { Moon, Sun } from "lucide-react-native"
import { Pressable, StyleSheet, Text, View } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"
import { useAppTheme } from "@/theme/ThemeProvider"

export default function SettingsScreen() {
  const { theme, themeMode, setThemeMode } = useAppTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.glow, { backgroundColor: theme.coolGlow }]} />

      <Animated.View
        entering={FadeInDown.springify().damping(18)}
        style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
      >
        <Text style={[styles.eyebrow, { color: theme.success }]}>Settings</Text>
        <Text style={[styles.title, { color: theme.text }]}>Choose your look.</Text>
        <Text style={[styles.body, { color: theme.textMuted }]}>
          Switch between a warm light mode and the darker practice mode. Your preference is saved on this device.
        </Text>

        <View style={styles.optionRow}>
          <ThemeOption
            label="Light"
            selected={themeMode === "light"}
            icon={<Sun color={themeMode === "light" ? theme.accentText : theme.text} size={18} />}
            onPress={() => setThemeMode("light")}
            theme={theme}
          />
          <ThemeOption
            label="Dark"
            selected={themeMode === "dark"}
            icon={<Moon color={themeMode === "dark" ? theme.accentText : theme.text} size={18} />}
            onPress={() => setThemeMode("dark")}
            theme={theme}
          />
        </View>
      </Animated.View>
    </View>
  )
}

function ThemeOption({
  label,
  selected,
  icon,
  onPress,
  theme,
}: {
  label: string
  selected: boolean
  icon: ReactNode
  onPress: () => void
  theme: ReturnType<typeof useAppTheme>["theme"]
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.option,
        {
          backgroundColor: selected ? theme.accent : theme.card,
          borderColor: selected ? theme.accent : theme.cardBorder,
        },
      ]}
    >
      {icon}
      <Text style={[styles.optionLabel, { color: selected ? theme.accentText : theme.text }]}>
        {label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 999,
    opacity: 0.15,
    top: -60,
    right: -70,
  },
  card: {
    borderRadius: 28,
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
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 10,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 22,
  },
  optionRow: {
    flexDirection: "row",
    gap: 12,
  },
  option: {
    flex: 1,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "800",
  },
})
