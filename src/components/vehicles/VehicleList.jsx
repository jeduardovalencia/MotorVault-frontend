import { Car } from 'lucide-react'
import { VehicleCard } from './VehicleCard'

function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-slate-700" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded col-span-2" />
      </div>
      <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-slate-700">
        <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded flex-1" />
        <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded flex-1" />
      </div>
    </div>
  )
}

export function VehicleList({ vehicles, isLoading, onEdit, onDelete }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
        <Car size={64} className="mb-4 opacity-30" />
        <p className="text-lg font-medium">No se encontraron vehículos</p>
        <p className="text-sm mt-1">Agrega tu primer vehículo con el botón de arriba</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
