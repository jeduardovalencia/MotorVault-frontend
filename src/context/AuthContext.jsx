import { createContext, useState, useCallback } from 'react'
import { loginApi, registerApi } from '../api/authApi'

export const AuthContext = createContext(null)

const TOKEN_KEY = 'motorvault-token'
const USER_KEY = 'motorvault-user'

// Lee localStorage de forma sincrónica en el primer render.
// Esto elimina la race condition: cuando ProtectedRoute evalúa
// isAuthenticated después del login, el estado ya está actualizado.
function readToken() {
  return localStorage.getItem(TOKEN_KEY)
}

function readUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(readToken)   // lazy init desde localStorage
  const [user, setUser] = useState(readUser)       // lazy init desde localStorage
  const isLoading = false                          // ya no hay carga asíncrona

  const getToken = useCallback(() => token, [token])

  const saveSession = (tokenValue, userData) => {
    localStorage.setItem(TOKEN_KEY, tokenValue)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    setToken(tokenValue)
    setUser(userData)
  }

  const login = async (email, password) => {
    const { data } = await loginApi(email, password)
    // El backend devuelve { success, data: { accessToken, role, email, firstName, lastName } }
    const payload = data.data ?? data
    const tokenValue = payload.accessToken ?? payload.token ?? payload.jwt ?? payload.jwtToken ?? payload.access_token
    if (!tokenValue) throw new Error('El servidor no devolvió un token. Revisa el campo en la respuesta del backend.')
    const userData = payload.user ?? {
      email: payload.email ?? email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      id: payload.id,
      role: payload.role ?? payload.roles,
    }
    saveSession(tokenValue, userData)
    return payload
  }

  const register = async (firstName, lastName, email, password) => {
    const { data } = await registerApi(firstName, lastName, email, password)
    const payload = data.data ?? data
    const tokenValue = payload.accessToken ?? payload.token ?? payload.jwt ?? payload.jwtToken ?? payload.access_token
    if (!tokenValue) throw new Error('El servidor no devolvió un token. Revisa el campo en la respuesta del backend.')
    const userData = payload.user ?? {
      email: payload.email ?? email,
      firstName: payload.firstName ?? firstName,
      lastName: payload.lastName ?? lastName,
      id: payload.id,
      role: payload.role ?? payload.roles,
    }
    saveSession(tokenValue, userData)
    return payload
  }

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, register, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  )
}
