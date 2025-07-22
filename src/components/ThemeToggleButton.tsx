import { ActionIcon } from '@mantine/core'
import { Sun, Moon } from 'lucide-react'
import type { ThemeName } from '../themes/themes'

interface ThemeToggleButtonProps {
  currentTheme: ThemeName
  onToggle: () => void
  className?: string
}

const ThemeToggleButton = ({ currentTheme, onToggle, className }: ThemeToggleButtonProps) => {
  const isLight = currentTheme === 'light'
  
  return (
    <ActionIcon
      variant="subtle"
      size="lg"
      onClick={onToggle}
      aria-label={`Cambiar a tema ${isLight ? 'oscuro' : 'claro'}`}
      tabIndex={0}
      className={className}
      title={`Cambiar a tema ${isLight ? 'oscuro' : 'claro'}`}
    >
      {isLight ? <Moon size={20} /> : <Sun size={20} />}
    </ActionIcon>
  )
}

export default ThemeToggleButton 