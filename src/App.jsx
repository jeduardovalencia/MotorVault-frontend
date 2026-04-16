import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { ProtectedAdminRoute } from './components/layout/ProtectedAdminRoute'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminUsuarios } from './pages/admin/AdminUsuarios'
import { AdminVehiculos } from './pages/admin/AdminVehiculos'
import { AdminLogs } from './pages/admin/AdminLogs'
import { useAuth } from './hooks/useAuth'

function hasAdminRole(user) {
  if (!user) return false
  const role = user.role ?? user.roles
  if (Array.isArray(role)) return role.includes('ROLE_ADMIN')
  return role === 'ROLE_ADMIN'
}

function RootRedirect() {
  const { isAuthenticated, isLoading, user } = useAuth()
  if (isLoading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Navigate to={hasAdminRole(user) ? '/admin/dashboard' : '/dashboard'} replace />
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* ── Admin routes ── */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="usuarios"  element={<AdminUsuarios />} />
              <Route path="vehiculos" element={<AdminVehiculos />} />
              <Route path="logs"      element={<AdminLogs />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
