import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { apiFetch, getToken, setToken, setUnauthorizedHandler } from '../api/client'
import type { User } from '../../types/models'

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const clearSession = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(clearSession)

    if (!getToken()) {
      setIsLoading(false)
      return
    }

    apiFetch<User>('/user')
      .then(setUser)
      .catch(() => clearSession())
      .finally(() => setIsLoading(false))
  }, [clearSession])

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiFetch<{ token: string; user: User }>('/login', {
      method: 'POST',
      body: { email, password },
    })
    setToken(response.token)
    setUser(response.user)
  }, [])

  const register = useCallback(
    async (name: string, email: string, password: string, passwordConfirmation: string) => {
      const response = await apiFetch<{ token: string; user: User }>('/register', {
        method: 'POST',
        body: { name, email, password, password_confirmation: passwordConfirmation },
      })
      setToken(response.token)
      setUser(response.user)
    },
    [],
  )

  const logout = useCallback(async () => {
    try {
      await apiFetch('/logout', { method: 'POST' })
    } finally {
      clearSession()
    }
  }, [clearSession])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
