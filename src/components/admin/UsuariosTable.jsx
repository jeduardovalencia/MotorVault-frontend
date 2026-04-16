import { Shield, ShieldOff, UserCog } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function RolBadge({ rol }) {
  const r = Array.isArray(rol) ? rol[0] : rol
  const isAdmin = r === 'ROLE_ADMIN'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
      isAdmin
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
        : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300'
    }`}>
      {isAdmin ? 'ADMIN' : 'USER'}
    </span>
  )
}

function EstadoBadge({ activo }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
      activo
        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
        : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
    }`}>
      {activo ? 'Activo' : 'Bloqueado'}
    </span>
  )
}

function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3 py-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="grid grid-cols-7 gap-4">
          {[...Array(7)].map((_, j) => (
            <div key={j} className="h-6 bg-gray-200 dark:bg-slate-700 rounded" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function UsuariosTable({ usuarios, onToggle, onCambiarRol, loading }) {
  if (loading) return <TableSkeleton />

  if (!usuarios?.length) {
    return <p className="text-center py-8 text-gray-400 text-sm">No se encontraron usuarios</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-slate-700">
            <th className="pb-3 pr-4 font-medium whitespace-nowrap">Nombre completo</th>
            <th className="pb-3 pr-4 font-medium">Email</th>
            <th className="pb-3 pr-4 font-medium">Rol</th>
            <th className="pb-3 pr-4 font-medium">Estado</th>
            <th className="pb-3 pr-4 font-medium">Vehículos</th>
            <th className="pb-3 pr-4 font-medium whitespace-nowrap">Fecha registro</th>
            <th className="pb-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => {
            const activo = u.activo ?? u.active ?? u.enabled ?? true
            return (
              <tr
                key={u.id}
                className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <td className="py-3 pr-4 font-medium text-gray-800 dark:text-white whitespace-nowrap">
                  {u.firstName ?? u.nombre ?? ''} {u.lastName ?? u.apellido ?? ''}
                </td>
                <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">{u.email}</td>
                <td className="py-3 pr-4">
                  <RolBadge rol={u.role ?? u.roles} />
                </td>
                <td className="py-3 pr-4">
                  <EstadoBadge activo={activo} />
                </td>
                <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                  {u.totalVehiculos ?? u.vehiculos ?? u.vehicleCount ?? 0}
                </td>
                <td className="py-3 pr-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {formatDate(u.creadoEn)}
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggle(u)}
                      title={activo ? 'Bloquear usuario' : 'Activar usuario'}
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                    >
                      {activo ? <ShieldOff size={16} /> : <Shield size={16} />}
                    </button>
                    <button
                      onClick={() => onCambiarRol(u)}
                      title="Cambiar rol"
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                    >
                      <UserCog size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
