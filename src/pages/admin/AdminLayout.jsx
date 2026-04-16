import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Car, ClipboardList,
  LogOut, Menu, X, Crown,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const NAV_LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard',  Icon: LayoutDashboard },
  { to: '/admin/usuarios',  label: 'Usuarios',   Icon: Users },
  { to: '/admin/vehiculos', label: 'Vehículos',  Icon: Car },
  { to: '/admin/logs',      label: 'Logs',       Icon: ClipboardList },
]

function SidebarContent({ onNavClick, onLogout }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
        <Crown size={22} className="text-yellow-400 shrink-0" />
        <span className="text-white font-bold text-base leading-tight">MotorVault Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {NAV_LINKS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <Icon size={17} className="shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-150"
        >
          <LogOut size={17} className="shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export function AdminLayout() {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex">

      {/* ── Desktop sidebar (always visible ≥ md) ── */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-800 dark:bg-slate-950 border-r border-slate-700 fixed inset-y-0 left-0 z-30">
        <SidebarContent onNavClick={() => {}} onLogout={handleLogout} />
      </aside>

      {/* ── Mobile backdrop ── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile sidebar drawer ── */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-slate-800 dark:bg-slate-950 border-r border-slate-700 z-50 flex flex-col md:hidden transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Cerrar menú"
        >
          <X size={20} />
        </button>
        <SidebarContent onNavClick={() => setOpen(false)} onLogout={handleLogout} />
      </aside>

      {/* ── Content area ── */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">

        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-4 px-4 py-3 bg-slate-800 dark:bg-slate-950 border-b border-slate-700 sticky top-0 z-20">
          <button
            onClick={() => setOpen(true)}
            className="text-slate-300 hover:text-white transition-colors"
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <Crown size={17} className="text-yellow-400" />
            <span className="text-white font-bold text-sm">MotorVault Admin</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
