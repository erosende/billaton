import { AppShell, NavLink, Title, Group, Image, MantineProvider, createTheme, Box } from '@mantine/core'
import { useState, useEffect } from 'react'
import { 
  FileText, 
  Users, 
  Building2
} from 'lucide-react'
import './App.css'
import RecipientsPage from './pages/RecipientsPage'
import ThemeToggleButton from './components/ThemeToggleButton'
import { applyTheme, getSystemColorScheme } from './themes/themes'
import type { ThemeName } from './themes/themes'

// Create custom Mantine theme that follows system preferences
const theme = createTheme({
  primaryColor: 'blue',
})

const App = () => {
  const [activeNav, setActiveNav] = useState('documents')
  const [colorScheme, setColorScheme] = useState<ThemeName>('light')
  const [manualOverride, setManualOverride] = useState(false)

  // Detect system color scheme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    // Set initial theme only if no manual override
    if (!manualOverride) {
      const systemTheme = getSystemColorScheme()
      setColorScheme(systemTheme)
      applyTheme(systemTheme)
    }

    // Listen for changes in system preference
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if no manual override is active
      if (!manualOverride) {
        const systemTheme = e.matches ? 'dark' : 'light'
        setColorScheme(systemTheme)
        applyTheme(systemTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    // Cleanup listener
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [manualOverride])

  // Apply theme whenever colorScheme changes
  useEffect(() => {
    applyTheme(colorScheme)
  }, [colorScheme])

  const handleNavClick = (value: string) => {
    setActiveNav(value)
  }

  const handleThemeToggle = () => {
    setManualOverride(true)
    const newTheme: ThemeName = colorScheme === 'light' ? 'dark' : 'light'
    setColorScheme(newTheme)
  }

  return (
    <MantineProvider theme={theme} forceColorScheme={colorScheme}>
      <AppShell
        navbar={{
          width: 200,
          breakpoint: 'sm',
        }}
        padding="md"
      >
        <AppShell.Navbar p="md" style={{ display: 'flex', flexDirection: 'column' }}>
          <Box style={{ flex: 1 }}>
            <Group mb="xl">
              <div className="logo-container">
                <Image src="/billaton_logo.png" alt="Billaton" width={100} height={100} fit='contain' />
                <div className="logo-text-container">
                  <Title order={3} className="logo-title">BILL</Title>
                  <Title order={3} className="logo-title">A</Title>
                  <Title order={3} className="logo-title">TON</Title>
                </div>
              </div>
            </Group>

            <NavLink
              href="#"
              label="Documentos"
              leftSection={<FileText size={20} />}
              active={activeNav === 'documents'}
              onClick={() => handleNavClick('documents')}
              aria-label="Navegar a documentos"
              tabIndex={0}
            />

            <NavLink
              href="#"
              label="Clientes"
              leftSection={<Users size={20} />}
              active={activeNav === 'recipients'}
              onClick={() => handleNavClick('recipients')}
              aria-label="Navegar a clientes"
              tabIndex={0}
            />

            <NavLink
              href="#"
              label="Facturadores"
              leftSection={<Building2 size={20} />}
              active={activeNav === 'issuers'}
              onClick={() => handleNavClick('issuers')}
              aria-label="Navegar a facturadores"
              tabIndex={0}
            />
          </Box>

          {/* Theme toggle button at bottom right */}
          <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
            <ThemeToggleButton
              currentTheme={colorScheme}
              onToggle={handleThemeToggle}
              className="theme-toggle-button"
            />
          </Box>

        </AppShell.Navbar>

        <AppShell.Main>
          <Title order={1} mb="lg" className="main-title">
            {activeNav === 'documents' && 'Documentos'}
            {activeNav === 'recipients' && 'Clientes'}
            {activeNav === 'issuers' && 'Facturadores'}
          </Title>
          
          <div>
            {activeNav === 'documents' && (
              <p>Gestiona tus facturas y documentos de facturación aquí.</p>
            )}
            {activeNav === 'recipients' && (
              <RecipientsPage />
            )}
            {activeNav === 'issuers' && (
              <p>Gestiona tus facturadores y sus configuraciones.</p>
            )}
          </div>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  )
}

export default App
