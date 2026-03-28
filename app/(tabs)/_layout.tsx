import { Tabs } from "expo-router"
import { Home, PlayCircle, Settings, TreePine } from "lucide-react-native"
import { useAppTheme } from "@/theme/ThemeProvider"

export default function TabLayout() {
  const { theme } = useAppTheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.cardBorder,
          borderTopWidth: 1,
          height: 74,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.tabInactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginBottom: 6,
        },
        tabBarHideOnKeyboard: true,
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
