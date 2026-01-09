// app/(tabs)/home.tsx
import { View, Text } from "react-native"

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#0E0B14", padding: 24 }}>
      <Text style={{ color: "white", fontSize: 24 }}>Profile</Text>
      <Text style={{ color: "#9CA3AF", marginTop: 8 }}>
        XP, streaks, stats will go here
      </Text>
    </View>
  )
}
