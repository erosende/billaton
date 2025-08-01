import React from 'react'
import { Menu, Button, Text, Group, Avatar } from '@mantine/core'
import { LogOut, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth()

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

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button 
          variant="subtle" 
          leftSection={<Avatar size="sm" radius="xl">{user.email?.charAt(0).toUpperCase()}</Avatar>}
          style={{ height: 'auto', padding: '0.5rem' }}
        >
          <Text size="sm" truncate style={{ maxWidth: '120px' }}>
            {user.email}
          </Text>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Usuario</Menu.Label>
        
        <Menu.Item 
          leftSection={<User size={14} />}
          disabled
        >
          <Text size="sm">{user.email?.split('@')[0]}</Text>
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