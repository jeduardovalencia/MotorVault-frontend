const colorMap = {
  blue:   { border: 'border-blue-500',   icon: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  green:  { border: 'border-green-500',  icon: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  yellow: { border: 'border-yellow-500', icon: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' },
  purple: { border: 'border-purple-500', icon: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  red:    { border: 'border-red-500',    icon: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
}

export function StatsCard({ titulo, valor, icono: Icono, color = 'blue' }) {
  const c = colorMap[color] ?? colorMap.blue

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow p-6 border-l-4 ${c.border} flex items-center justify-between`}>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{titulo}</p>
        <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
          {valor ?? <span className="text-gray-300 dark:text-slate-600">—</span>}
        </p>
      </div>
      {Icono && (
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${c.icon}`}>
          <Icono size={24} />
        </div>
      )}
    </div>
  )
}
