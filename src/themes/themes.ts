export type ThemeName = 'light' | 'dark'

export interface ThemeColors {
  '--app-bg-color': string
  '--app-text-color': string
  '--app-border-color': string
  '--app-accent-color': string
  '--app-accent-hover': string
  '--app-button-bg': string
  '--app-navbar-bg': string
  '--app-content-bg': string
}

export const themes: Record<ThemeName, ThemeColors> = {
  light: {
    '--app-bg-color': '#ffffff',
    '--app-text-color': '#213547',
    '--app-border-color': '#e0e0e0',
    '--app-accent-color': '#646cff',
    '--app-accent-hover': '#747bff',
    '--app-button-bg': '#f9f9f9',
    '--app-navbar-bg': '#ffffff',
    '--app-content-bg': '#ffffff',
  },
  dark: {
    '--app-bg-color': '#1a1a1a',
    '--app-text-color': 'rgba(255, 255, 255, 0.87)',
    '--app-border-color': '#404040',
    '--app-accent-color': '#646cff',
    '--app-accent-hover': '#535bf2',
    '--app-button-bg': '#2a2a2a',
    '--app-navbar-bg': '#242424',
    '--app-content-bg': '#1e1e1e',
  }
}

/**
 * Apply a theme to the document root by setting CSS custom properties
 */
export const applyTheme = (themeName: ThemeName): void => {
  const root = document.documentElement
  const themeVars = themes[themeName]
  
  Object.entries(themeVars).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })
  
  // Also set the color-scheme property
  root.style.setProperty('color-scheme', themeName)
}

/**
 * Detect the user's system color scheme preference
 */
export const getSystemColorScheme = (): ThemeName => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
} 