// app/_layout.tsx
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="session" />
      </Stack>
    </>
  )
}
