import React from 'react'
import { Menu, Button, Text, Avatar } from '@mantine/core'
import { LogOut, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const UserMenu: React.FC = () => {
  const { user, signOut, getUserDisplayName } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!user) {
    return null
  }

  const displayName = getUserDisplayName(user)
  const avatarLetter = displayName.charAt(0).toUpperCase()

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button 
          variant="subtle" 
          leftSection={<Avatar size="sm" radius="xl">{avatarLetter}</Avatar>}
          style={{ height: 'auto', padding: '0.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}
        >
          <Text size="sm" truncate style={{ maxWidth: '120px' }}>
            {displayName}
          </Text>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Usuario</Menu.Label>
        
        <Menu.Item 
          leftSection={<User size={14} />}
          disabled
        >
          <Text size="sm">{displayName}</Text>
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          leftSection={<LogOut size={14} />}
          onClick={handleSignOut}
          color="red"
        >
          Cerrar sesión
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

export default UserMenu