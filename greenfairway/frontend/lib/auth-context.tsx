'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { api, User } from './api'

interface AuthCtx {
  user: User | null
  token: string | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('gf_token')
    if (t) {
      setToken(t)
      api.me().then(setUser).catch(() => {
        localStorage.removeItem('gf_token')
      }).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username: string, password: string) => {
    const res = await api.login({ username, password })
    localStorage.setItem('gf_token', res.token)
    setToken(res.token)
    setUser(res.user)
  }

  const register = async (username: string, email: string, password: string) => {
    const res = await api.register({ username, email, password })
    localStorage.setItem('gf_token', res.token)
    setToken(res.token)
    setUser(res.user)
  }

  const logout = async () => {
    await api.logout().catch(() => {})
    localStorage.removeItem('gf_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
