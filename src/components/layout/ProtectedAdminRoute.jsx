import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function hasAdminRole(user) {
  if (!user) return false
  const role = user.role ?? user.roles
  if (Array.isArray(role)) return role.includes('ROLE_ADMIN')
  return role === 'ROLE_ADMIN'
}

export function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="w-10 h-10 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!hasAdminRole(user)) return <Navigate to="/dashboard" replace />

  return children
}
