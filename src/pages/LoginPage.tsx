import React, { useState } from 'react'
import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Group,
  Image,
  Stack,
  Alert,
  Loader,
  Box
} from '@mantine/core'
import { AlertCircle, LogIn } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import './LoginPage.css'

const LoginPage: React.FC = () => {
  const { signIn, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!email || !password) {
      setError('Por favor, completa todos los campos requeridos')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError('Ha ocurrido un error inesperado')
    } finally {
      setIsSubmitting(false)
    }
  }



  if (loading) {
    return (
      <Container size="xs" className="login-container">
        <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Loader size="lg" />
        </Box>
      </Container>
    )
  }

  return (
    <Container size="xs" className="login-container">
      <div className="login-content">
        <Paper radius="md" p="xl" withBorder className="login-paper">
          <Group justify="center" mb="xl">
            <div className="login-logo-container">
              <Image 
                src="/billaton_logo.png" 
                alt="Billaton" 
                width={100} 
                height={100} 
                fit="contain" 
              />
              <div className="login-logo-text">
                <Title order={2} className="login-title">BILL A TON</Title>
                <Text size="sm" c="dimmed" ta="center">
                  Sistema de facturación
                </Text>
              </div>
            </div>
          </Group>

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              {error && (
                <Alert
                  icon={<AlertCircle size={16} />}
                  color="red"
                  variant="light"
                  title="Error"
                >
                  {error}
                </Alert>
              )}



              <TextInput
                label="Email"
                placeholder="tu@email.com"
                required
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                disabled={isSubmitting}
              />

              <PasswordInput
                label="Contraseña"
                placeholder="Tu contraseña"
                required
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
                disabled={isSubmitting}
              />



              <Button
                type="submit"
                fullWidth
                leftSection={<LogIn size={16} />}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Iniciar sesión
              </Button>
            </Stack>
          </form>


        </Paper>
      </div>
    </Container>
  )
}

export default LoginPage