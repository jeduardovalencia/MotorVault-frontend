import { Trash2 } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
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

export function VehiculosTable({ vehiculos, onEliminar, loading }) {
  if (loading) return <TableSkeleton />

  if (!vehiculos?.length) {
    return <p className="text-center py-8 text-gray-400 text-sm">No se encontraron vehículos</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-slate-700">
            <th className="pb-3 pr-4 font-medium">Placa</th>
            <th className="pb-3 pr-4 font-medium">Marca / Modelo</th>
            <th className="pb-3 pr-4 font-medium">Año</th>
            <th className="pb-3 pr-4 font-medium">Color</th>
            <th className="pb-3 pr-4 font-medium">Dueño</th>
            <th className="pb-3 pr-4 font-medium whitespace-nowrap">Fecha registro</th>
            <th className="pb-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((v) => (
            <tr
              key={v.id}
              className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td className="py-3 pr-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md font-mono text-xs font-bold bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-white">
                  {v.placa ?? v.licensePlate ?? '—'}
                </span>
              </td>
              <td className="py-3 pr-4 font-medium text-gray-800 dark:text-white whitespace-nowrap">
                {v.marca ?? v.brand} {v.modelo ?? v.model}
              </td>
              <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">{v.anio ?? v.year ?? '—'}</td>
              <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">{v.color ?? '—'}</td>
              <td className="py-3 pr-4">
                <p className="text-gray-800 dark:text-white text-xs font-medium">
                  {v.usuarioNombre ?? '—'}
                </p>
              </td>
              <td className="py-3 pr-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {formatDate(v.creadoEn)}
              </td>
              <td className="py-3">
                <button
                  onClick={() => onEliminar(v)}
                  title="Eliminar vehículo"
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
