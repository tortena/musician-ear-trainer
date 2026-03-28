export type AppThemeMode = "light" | "dark"

export type AppTheme = {
  mode: AppThemeMode
  statusBar: "light" | "dark"
  background: string
  surface: string
  surfaceAlt: string
  card: string
  cardBorder: string
  text: string
  textMuted: string
  textSoft: string
  accent: string
  accentText: string
  accentSoft: string
  success: string
  successSoft: string
  danger: string
  dangerSoft: string
  warning: string
  warmGlow: string
  coolGlow: string
  tabInactive: string
  progressTrack: string
  progressFill: string
}

export const themes: Record<AppThemeMode, AppTheme> = {
  dark: {
    mode: "dark",
    statusBar: "light",
    background: "#120F0D",
    surface: "rgba(27,22,18,0.95)",
    surfaceAlt: "#1A302D",
    card: "rgba(27,22,18,0.94)",
    cardBorder: "rgba(255,255,255,0.08)",
    text: "#FFF7ED",
    textMuted: "#D7C7BC",
    textSoft: "#B9A89D",
    accent: "#E46F2C",
    accentText: "#1A120E",
    accentSoft: "#2C211B",
    success: "#6EE7B7",
    successSoft: "#173730",
    danger: "#FCA5A5",
    dangerSoft: "#3F0D16",
    warning: "#F59E0B",
    warmGlow: "#A43E1B",
    coolGlow: "#1C6E63",
    tabInactive: "#9A8B80",
    progressTrack: "#2D241F",
    progressFill: "#F59E0B",
  },
  light: {
    mode: "light",
    statusBar: "dark",
    background: "#F6F3EE",
    surface: "rgba(255,250,245,0.97)",
    surfaceAlt: "#E0F1ED",
    card: "#FFFBF6",
    cardBorder: "rgba(83,61,43,0.08)",
    text: "#1E1A16",
    textMuted: "#51473F",
    textSoft: "#74675D",
    accent: "#D95D1A",
    accentText: "#FFF9F2",
    accentSoft: "#FBE6D8",
    success: "#178F62",
    successSoft: "#DFF5EC",
    danger: "#C54A4A",
    dangerSoft: "#FCE3E3",
    warning: "#D08A00",
    warmGlow: "#F4C7A6",
    coolGlow: "#B7E1D9",
    tabInactive: "#8E8177",
    progressTrack: "#E7DDD3",
    progressFill: "#D95D1A",
  },
}
