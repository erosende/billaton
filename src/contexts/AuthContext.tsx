import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

// Define types based on what Supabase returns
type UserMetadata = {
  display_name?: string
  email_verified?: boolean
  [key: string]: any
}

type User = {
  id: string
  email?: string
  user_metadata?: UserMetadata
  [key: string]: any
} | null

type Session = {
  user: User
  access_token: string
  [key: string]: any
} | null

type AuthError = {
  message: string
} | null

// Helper function to get user display name
const getUserDisplayName = (user: User): string => {
  if (!user) return 'Usuario'
  
  // Try display_name from user_metadata first
  if (user.user_metadata?.display_name) {
    return user.user_metadata.display_name
  }
  
  // Fallback to email username part
  if (user.email) {
    return user.email.split('@')[0]
  }
  
  // Final fallback
  return 'Usuario'
}

// Define the authentication context interface
interface AuthContextType {
  user: User
  session: Session
  loading: boolean
  getUserDisplayName: (user: User) => string
  signIn: (email: string, password: string) => Promise<{ error: AuthError }>
  signOut: () => Promise<{ error: AuthError }>
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Custom hook to use the authentication context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Authentication provider component
interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(null)
  const [session, setSession] = useState<Session>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
      } else {
        setSession(session)
        setUser(session?.user ?? null)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe()
  }, [])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)
    return { error: error || null }
  }



  // Sign out function
  const signOut = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    setLoading(false)
    return { error: error || null }
  }

  // Context value
  const value: AuthContextType = {
    user,
    session,
    loading,
    getUserDisplayName,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider