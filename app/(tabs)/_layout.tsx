// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router"
import { Home, TreePine, PlayCircle, Settings } from "lucide-react-native"

const PURPLE = "#8B5CF6"
const BG = "#0E0B14"
const MUTED = "#6B7280"

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: BG,
          borderTopColor: "#1F1B2E",
          height: 64,
        },
        tabBarActiveTintColor: PURPLE,
        tabBarInactiveTintColor: MUTED,
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 6,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="skill-tree"
        options={{
          title: "Skills",
          tabBarIcon: ({ color, size }) => (
            <TreePine color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="start"
        options={{
          title: "Start",
          tabBarIcon: ({ color, size }) => (
            <PlayCircle color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  )
}
