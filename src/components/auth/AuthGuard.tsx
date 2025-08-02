import React from 'react'
import { Container, Loader, Box } from '@mantine/core'
import { useAuth } from '../../contexts/AuthContext'
import LoginPage from '../../pages/LoginPage'

interface AuthGuardProps {
  children: React.ReactNode
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Container size="xs">
        <Box style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <Loader size="lg" />
        </Box>
      </Container>
    )
  }

  // Show login page if user is not authenticated
  if (!user) {
    return <LoginPage />
  }

  // Show protected content if user is authenticated
  return <>{children}</>
}

export default AuthGuard