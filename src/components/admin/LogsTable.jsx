function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('es-ES')
}

const ACTION_COLORS = {
  LOGIN:                'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  CREATE_VEHICLE:       'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  DELETE_VEHICLE:       'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  ADMIN_BLOCK_USER:     'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  ADMIN_UNBLOCK_USER:   'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  ADMIN_CHANGE_ROLE:    'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  ADMIN_DELETE_VEHICLE: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
}

function getActionColor(accion) {
  if (ACTION_COLORS[accion]) return ACTION_COLORS[accion]
  if (accion?.startsWith('CREATE')) return ACTION_COLORS.CREATE_VEHICLE
  if (accion?.startsWith('DELETE')) return ACTION_COLORS.DELETE_VEHICLE
  if (accion?.startsWith('ADMIN'))  return ACTION_COLORS.ADMIN_BLOCK_USER
  return 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300'
}

function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3 py-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, j) => (
            <div key={j} className="h-6 bg-gray-200 dark:bg-slate-700 rounded" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function LogsTable({ logs, loading, compact = false }) {
  if (loading) return <TableSkeleton />

  if (!logs?.length) {
    return <p className="text-center py-8 text-gray-400 text-sm">No se encontraron logs</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-slate-700">
            <th className="pb-3 pr-4 font-medium">Acción</th>
            <th className="pb-3 pr-4 font-medium">Descripción</th>
            {!compact && <th className="pb-3 pr-4 font-medium">Usuario</th>}
            {!compact && <th className="pb-3 pr-4 font-medium">IP</th>}
            <th className="pb-3 font-medium whitespace-nowrap">Fecha y hora</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => {
            const accion = log.accion ?? log.action ?? ''
            return (
              <tr
                key={log.id ?? i}
                className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <td className="py-3 pr-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getActionColor(accion)}`}>
                    {accion || '—'}
                  </span>
                </td>
                <td className="py-3 pr-4 text-gray-600 dark:text-gray-300 max-w-xs truncate">
                  {log.descripcion ?? log.description ?? '—'}
                </td>
                {!compact && (
                  <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                    {log.usuarioEmail ?? '—'}
                  </td>
                )}
                {!compact && (
                  <td className="py-3 pr-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                    {log.ip ?? '—'}
                  </td>
                )}
                <td className="py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {formatDateTime(log.creadoEn)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
