// app/_layout.tsx
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import "../global.css"


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
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="session" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}
