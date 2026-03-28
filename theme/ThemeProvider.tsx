import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { loadData, saveData, StorageKey } from "@/storage/storage"
import { AppThemeMode, themes } from "./theme"

type ThemeContextValue = {
  themeMode: AppThemeMode
  setThemeMode: (mode: AppThemeMode) => Promise<void>
  theme: (typeof themes)[AppThemeMode]
  isReady: boolean
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<AppThemeMode>("dark")
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let mounted = true

    async function loadTheme() {
      const stored = await loadData<AppThemeMode>(StorageKey.APP_THEME)
      if (!mounted) return

      if (stored === "light" || stored === "dark") {
        setThemeModeState(stored)
      }

      setIsReady(true)
    }

    loadTheme()
    return () => {
      mounted = false
    }
  }, [])

  async function setThemeMode(mode: AppThemeMode) {
    setThemeModeState(mode)
    await saveData(StorageKey.APP_THEME, mode)
  }

  const value = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      theme: themes[themeMode],
      isReady,
    }),
    [themeMode, isReady]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useAppTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useAppTheme must be used within ThemeProvider")
  }

  return context
}
