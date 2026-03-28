import { View, Text, Pressable, StyleSheet } from "react-native"
import { useAppTheme } from "@/theme/ThemeProvider"

type Props = {
  onUndo: () => void
  onCheck: () => void
  onContinue: () => void
  disabled: boolean
  answered: boolean
}

export function BottomActionBar({
  onUndo,
  onCheck,
  onContinue,
  disabled,
  answered,
}: Props) {
  const { theme } = useAppTheme()

  return (
    <View style={[styles.bar, { borderTopColor: theme.cardBorder, backgroundColor: theme.background }]}>
      <Pressable onPress={onUndo} disabled={answered}>
        <Text style={[styles.undo, { color: theme.textSoft }]}>Undo</Text>
      </Pressable>

      <Pressable
        onPress={answered ? onContinue : onCheck}
        disabled={!answered && disabled}
        style={[
          styles.primaryAction,
          {
            backgroundColor: answered ? theme.success : theme.accent,
          },
          !answered && disabled && styles.primaryActionDisabled,
        ]}
      >
        <Text style={[styles.primaryActionText, { color: theme.accentText }]}>
          {answered ? "CONTINUE" : "CHECK"}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 18,
    borderTopWidth: 1,
  },
  undo: {
    color: "#A78BFA",
    fontSize: 16,
  },
  primaryAction: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 18,
  },
  primaryActionDisabled: {
    opacity: 0.4,
  },
  primaryActionText: {
    color: "white",
    fontWeight: "700",
  },
})
