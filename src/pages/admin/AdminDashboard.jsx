import { useState, useEffect } from 'react'
import { Users, UserCheck, Car, BarChart2 } from 'lucide-react'
import { getStats, getLogs } from '../../api/adminApi'
import { StatsCard } from '../../components/admin/StatsCard'
import { LogsTable } from '../../components/admin/LogsTable'

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-200 dark:bg-slate-700 rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded-xl" />
      <div className="h-56 bg-gray-200 dark:bg-slate-700 rounded-xl" />
    </div>
  )
}

export function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getStats()
      .then(({ data }) => setStats(data.data ?? data))
      .catch(() => setError('Error al cargar estadísticas'))
      .finally(() => setLoading(false))
    getLogs({})
      .then(({ data }) => setLogs((data.data ?? data).slice(0, 5)))
      .catch(() => {})
  }, [])

  if (loading) return <DashboardSkeleton />

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    )
  }

  const marcas = Array.isArray(stats?.vehiculosPorMarca)
    ? [...stats.vehiculosPorMarca].sort((a, b) => b.cantidad - a.cantidad)
    : Object.entries(stats?.vehiculosPorMarca ?? {}).map(([marca, cantidad]) => ({
        marca,
        cantidad,
      })).sort((a, b) => b.cantidad - a.cantidad)

  const total = marcas.reduce((sum, r) => sum + (r.cantidad ?? 0), 0)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard titulo="Total Usuarios"      valor={stats?.totalUsuarios}     icono={Users}      color="blue" />
        <StatsCard titulo="Usuarios Activos"    valor={stats?.usuariosActivos}   icono={UserCheck}  color="green" />
        <StatsCard titulo="Total Vehículos"     valor={stats?.totalVehiculos}    icono={Car}        color="yellow" />
        <StatsCard titulo="Marcas Registradas"  valor={marcas.length}            icono={BarChart2}  color="purple" />
      </div>

      {/* ── Vehicles by brand ── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4">Vehículos por Marca</h2>
        {marcas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-slate-700">
                  <th className="pb-3 font-medium">Marca</th>
                  <th className="pb-3 font-medium">Cantidad</th>
                  <th className="pb-3 font-medium">Porcentaje</th>
                </tr>
              </thead>
              <tbody>
                {marcas.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="py-3 font-medium text-gray-800 dark:text-white">{row.marca}</td>
                    <td className="py-3 text-gray-600 dark:text-gray-300">{row.cantidad}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(total > 0 ? Math.round((row.cantidad / total) * 100) : 0, 100)}%` }}
                          />
                        </div>
                        <span className="text-gray-600 dark:text-gray-300 text-xs">
                          {total > 0 ? Math.round((row.cantidad / total) * 100) : 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-400">No hay datos disponibles</p>
        )}
      </div>

      {/* ── Recent activity logs ── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4">Últimos Logs</h2>
        <LogsTable logs={logs} loading={false} compact />
      </div>
    </div>
  )
}
