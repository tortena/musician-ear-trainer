import { View, Text, Pressable, StyleSheet } from "react-native"

type Props = {
  onUndo: () => void
  onCheck: () => void
  disabled: boolean
  answered: boolean
}

export function BottomActionBar({
  onUndo,
  onCheck,
  disabled,
  answered,
}: Props) {
  return (
    <View style={styles.bar}>
      <Pressable onPress={onUndo}>
        <Text style={styles.undo}>Undo</Text>
      </Pressable>

      <Pressable
        onPress={onCheck}
        disabled={disabled || answered}
        style={[
          styles.check,
          (disabled || answered) && styles.checkDisabled,
        ]}
      >
        <Text style={styles.checkText}>CHECK</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
  },
  undo: {
    color: "#A78BFA",
    fontSize: 16,
  },
  check: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 16,
  },
  checkDisabled: {
    opacity: 0.4,
  },
  checkText: {
    color: "white",
    fontWeight: "700",
  },
})
