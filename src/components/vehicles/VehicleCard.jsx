import { Car, Pencil, Trash2, Palette, Calendar, Hash } from 'lucide-react'
import { Button } from '../ui/Button'

export function VehicleCard({ vehicle, onEdit, onDelete }) {
  const { placa, marca, modelo, año, color, fotoUrl, creadoEn } = vehicle

  return (
    <div className="card flex flex-col gap-4 group">
      {/* Vehicle image */}
      {fotoUrl ? (
        <div className="-mx-6 -mt-6 rounded-t-xl overflow-hidden h-[150px]">
          <img
            src={fotoUrl}
            alt={`${marca} ${modelo}`}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.parentElement.replaceWith(Object.assign(document.createElement('div'), { className: 'hidden' })) }}
          />
        </div>
      ) : (
        <div className="-mx-6 -mt-6 rounded-t-xl h-[150px] bg-[#1e3a5f]/10 dark:bg-slate-700 flex items-center justify-center">
          <Car size={48} className="text-[#1e3a5f]/30 dark:text-blue-400/30" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight">
            {marca} {modelo}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono uppercase tracking-wider">
            {placa}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Calendar size={14} className="flex-shrink-0" />
          <span>{año}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Palette size={14} className="flex-shrink-0" />
          <span className="capitalize">{color}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 col-span-2">
          <Hash size={14} className="flex-shrink-0" />
          <span className="font-mono">{placa}</span>
        </div>
      </div>

      {/* Registration date */}
      <p className="text-xs text-gray-400 dark:text-gray-500">
        {creadoEn
          ? `Registrado el ${new Date(creadoEn).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`
          : '—'}
      </p>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-slate-700">
        <Button
          variant="secondary"
          className="flex-1 text-sm py-1.5"
          onClick={() => onEdit(vehicle)}
        >
          <Pencil size={14} />
          Editar
        </Button>
        <Button
          variant="danger"
          className="flex-1 text-sm py-1.5"
          onClick={() => onDelete(vehicle)}
        >
          <Trash2 size={14} />
          Eliminar
        </Button>
      </div>
    </div>
  )
}
