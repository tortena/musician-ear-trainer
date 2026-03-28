import { Text, Pressable, StyleSheet } from "react-native"
import Animated from "react-native-reanimated"
import { useAppTheme } from "@/theme/ThemeProvider"

type Props = {
  label: string
  onPress?: () => void
  selected?: boolean
  correct?: boolean
  incorrect?: boolean
  disabled?: boolean
}

export function TokenChip({
  label,
  onPress,
  selected,
  correct,
  incorrect,
  disabled,
}: Props) {
  const { theme } = useAppTheme()

  return (
    <Animated.View>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.chip,
          { backgroundColor: theme.card, borderColor: theme.cardBorder },
          selected && { backgroundColor: theme.accent, borderColor: theme.accent },
          correct && { backgroundColor: theme.success, borderColor: theme.success },
          incorrect && { backgroundColor: theme.danger, borderColor: theme.danger },
          disabled && styles.disabled,
        ]}
      >
        <Text style={[styles.text, { color: selected || correct || incorrect ? theme.accentText : theme.text }]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    margin: 6,
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    color: "white",
    fontWeight: "600",
  },
})
