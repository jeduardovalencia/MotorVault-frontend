import { useState, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { getUsuarios, toggleUsuario, cambiarRol } from '../../api/adminApi'
import { UsuariosTable } from '../../components/admin/UsuariosTable'
import { Toast } from '../../components/ui/Toast'

const INITIAL_FILTROS = { busqueda: '', activo: '' }

export function AdminUsuarios() {
  const [usuarios, setUsuarios]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [toast, setToast]           = useState(null)
  const [filtros, setFiltros]       = useState(INITIAL_FILTROS)
  const [formFiltros, setFormFiltros] = useState(INITIAL_FILTROS)
  const [rolModal, setRolModal]     = useState(null) // { usuario, nuevoRol }

  const fetchUsuarios = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await getUsuarios(filtros.busqueda, filtros.activo)
      const payload = data.data ?? data
      setUsuarios(Array.isArray(payload) ? payload : (payload.content ?? payload.usuarios ?? []))
    } catch {
      setToast({ message: 'Error al cargar usuarios', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [filtros])

  useEffect(() => { fetchUsuarios() }, [fetchUsuarios])

  const handleBuscar = (e) => {
    e.preventDefault()
    setFiltros({ ...formFiltros })
  }

  const handleLimpiar = () => {
    setFormFiltros(INITIAL_FILTROS)
    setFiltros(INITIAL_FILTROS)
  }

  const handleToggle = async (usuario) => {
    const activo = usuario.activo ?? usuario.active ?? usuario.enabled ?? true
    const accion = activo ? 'bloquear' : 'activar'
    if (!window.confirm(`¿Deseas ${accion} al usuario "${usuario.email}"?`)) return
    try {
      await toggleUsuario(usuario.id)
      setToast({ message: `Usuario ${activo ? 'bloqueado' : 'activado'} correctamente`, type: 'success' })
      fetchUsuarios()
    } catch {
      setToast({ message: `Error al ${accion} el usuario`, type: 'error' })
    }
  }

  const handleCambiarRol = (usuario) => {
    const rolActual = Array.isArray(usuario.role ?? usuario.roles)
      ? (usuario.role ?? usuario.roles)[0]
      : (usuario.role ?? usuario.roles)
    setRolModal({ usuario, nuevoRol: rolActual === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN' })
  }

  const confirmarCambioRol = async () => {
    if (!rolModal) return
    const { usuario, nuevoRol } = rolModal
    if (!window.confirm(`¿Cambiar el rol de "${usuario.email}" a ${nuevoRol}?`)) {
      setRolModal(null)
      return
    }
    try {
      await cambiarRol(usuario.id, nuevoRol)
      setToast({ message: 'Rol actualizado correctamente', type: 'success' })
      setRolModal(null)
      fetchUsuarios()
    } catch {
      setToast({ message: 'Error al cambiar el rol', type: 'error' })
      setRolModal(null)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Usuarios</h1>

      {/* ── Filters ── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4">
        <form onSubmit={handleBuscar} className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Buscar</label>
            <input
              type="text"
              value={formFiltros.busqueda}
              onChange={(e) => setFormFiltros(f => ({ ...f, busqueda: e.target.value }))}
              placeholder="Nombre o email…"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="min-w-[150px]">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Estado</label>
            <select
              value={formFiltros.activo}
              onChange={(e) => setFormFiltros(f => ({ ...f, activo: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Bloqueados</option>
            </select>
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Search size={15} />
            Buscar
          </button>
          <button
            type="button"
            onClick={handleLimpiar}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            <X size={15} />
            Limpiar
          </button>
        </form>
      </div>

      {/* ── Table ── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
        <UsuariosTable
          usuarios={usuarios}
          onToggle={handleToggle}
          onCambiarRol={handleCambiarRol}
          loading={loading}
        />
      </div>

      {/* ── Role change modal ── */}
      {rolModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Cambiar Rol</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Usuario: <span className="font-semibold text-gray-700 dark:text-gray-200">{rolModal.usuario.email}</span>
            </p>
            <div className="mb-5">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Nuevo rol</label>
              <select
                value={rolModal.nuevoRol}
                onChange={(e) => setRolModal(m => ({ ...m, nuevoRol: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ROLE_USER">USER</option>
                <option value="ROLE_ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setRolModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarCambioRol}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
