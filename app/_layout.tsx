// app/_layout.tsx
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { ThemeProvider, useAppTheme } from "@/theme/ThemeProvider"
import "../global.css"


export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  )
}

function AppShell() {
  const { theme } = useAppTheme()

  return (
    <>
      <StatusBar style={theme.statusBar} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="session" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}
