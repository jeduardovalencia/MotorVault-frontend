import { useState, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { getLogs } from '../../api/adminApi'
import { LogsTable } from '../../components/admin/LogsTable'
import { Toast } from '../../components/ui/Toast'

const ACCIONES = [
  'LOGIN',
  'CREATE_VEHICLE',
  'DELETE_VEHICLE',
  'ADMIN_BLOCK_USER',
  'ADMIN_UNBLOCK_USER',
  'ADMIN_CHANGE_ROLE',
  'ADMIN_DELETE_VEHICLE',
]

const INITIAL_FILTROS = { accion: '', desde: '', hasta: '' }

export function AdminLogs() {
  const [logs, setLogs]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [toast, setToast]       = useState(null)
  const [filtros, setFiltros]   = useState(INITIAL_FILTROS)
  const [formFiltros, setFormFiltros] = useState(INITIAL_FILTROS)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await getLogs(filtros)
      const payload = data.data ?? data
      setLogs(Array.isArray(payload) ? payload : (payload.content ?? payload.logs ?? []))
    } catch {
      setToast({ message: 'Error al cargar logs', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [filtros])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  const handleBuscar = (e) => {
    e.preventDefault()
    setFiltros({ ...formFiltros })
  }

  const handleLimpiar = () => {
    setFormFiltros(INITIAL_FILTROS)
    setFiltros(INITIAL_FILTROS)
  }

  const update = (key) => (e) =>
    setFormFiltros(f => ({ ...f, [key]: e.target.value }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Logs de Actividad</h1>

      {/* ── Filters ── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4">
        <form onSubmit={handleBuscar} className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Acción</label>
            <select
              value={formFiltros.accion}
              onChange={update('accion')}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas</option>
              {ACCIONES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="min-w-[160px]">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Desde</label>
            <input
              type="date"
              value={formFiltros.desde}
              onChange={update('desde')}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="min-w-[160px]">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Hasta</label>
            <input
              type="date"
              value={formFiltros.hasta}
              onChange={update('hasta')}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
        <LogsTable logs={logs} loading={loading} />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
