import { Sun, Moon, LogOut, Car } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'

export function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.email || 'Usuario'

  return (
    <nav className="sticky top-0 z-40 bg-[#1e3a5f] dark:bg-slate-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Car size={24} className="text-white" />
            <span className="text-white font-bold text-xl tracking-tight">
              MotorVault
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* User name */}
            <span className="hidden sm:block text-blue-100 text-sm font-medium">
              {displayName}
            </span>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Cambiar tema"
              className="p-2 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-colors duration-300"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              aria-label="Cerrar sesión"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
