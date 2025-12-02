'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { showToast } from '@/helpers/toast'
import { useLanguage } from './LanguageContext'

export interface UserSession {
  id: string
  username: string
  name: string
  email: string
  role: 'Admin' | 'Customer'
  isActive: boolean
  loginTime: string
}

interface AuthContextType {
  user: UserSession | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (sessionData: UserSession) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'userSession'

/**
 * Normalize Google user to our UserSession format
 */
function normalizeGoogleUser(googleUser: any): UserSession {
  return {
    id: 'google-user',
    username: googleUser.name || 'User',
    name: googleUser.name || 'User',
    email: googleUser.email || '',
    role: 'Customer',
    isActive: true,
    loginTime: new Date().toISOString(),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: googleSession, status } = useSession()
  const { t } = useLanguage()
  const [dbUser, setDbUser] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Load database user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const sessionData = localStorage.getItem(STORAGE_KEY)
        if (sessionData) {
          const parsedUser = JSON.parse(sessionData)
          setDbUser(parsedUser)
        } else {
          setDbUser(null)
        }
      } catch (error) {
        console.error('Error loading user session:', error)
        localStorage.removeItem(STORAGE_KEY)
        setDbUser(null)
      }
    }

    loadUser()

    // Listen for changes in localStorage from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        if (e.newValue) {
          try {
            const parsedUser = JSON.parse(e.newValue)
            setDbUser(parsedUser)
          } catch (error) {
            console.error('Error parsing user from storage event:', error)
          }
        } else {
          setDbUser(null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Update loading state based on NextAuth status
  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [status])

  // Unified user: prefer Google session, fallback to database user
  const user = googleSession?.user 
    ? normalizeGoogleUser(googleSession.user)
    : dbUser

  const isAuthenticated = user !== null
  const isAdmin = user?.role === 'Admin'

  /**
   * Login with database credentials
   * Saves session to localStorage
   */
  const login = (sessionData: UserSession) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData))
      setDbUser(sessionData)
    } catch (error) {
      console.error('Error saving user session:', error)
      showToast.error(t('messages.errorSavingSession'))
    }
  }

  /**
   * Logout - handles both Google and database sessions
   */
  const logout = async () => {
    try {
      if (googleSession) {
        // Google session - use NextAuth signOut
        await signOut({ callbackUrl: '/login' })
      } else {
        // Database session - clear localStorage
        localStorage.removeItem(STORAGE_KEY)
        setDbUser(null)
        showToast.info(t('messages.loggedOutSuccess'), { autoClose: 2000 })
        router.push('/login')
      }
    } catch (error) {
      console.error('Error during logout:', error)
      showToast.error(t('messages.errorLoggingOut'))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to access auth context
 * Must be used within AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

