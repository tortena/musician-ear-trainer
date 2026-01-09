import { Text, Pressable, StyleSheet } from "react-native"
import Animated from "react-native-reanimated"

type Props = {
  label: string
  onPress?: () => void
  selected?: boolean
  correct?: boolean
  disabled?: boolean
}

export function TokenChip({
  label,
  onPress,
  selected,
  correct,
  disabled,
}: Props) {
  return (
    <Animated.View>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.chip,
          selected && styles.selected,
          correct && styles.correct,
          disabled && styles.disabled,
        ]}
      >
        <Text style={styles.text}>{label}</Text>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: "#1A1625",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    margin: 6,
  },
  selected: {
    backgroundColor: "#8B5CF6",
  },
  correct: {
    backgroundColor: "#22C55E",
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    color: "white",
    fontWeight: "600",
  },
})
