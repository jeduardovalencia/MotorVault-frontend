import { Link } from 'react-router-dom'
import { Car, Home } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-[#1e3a5f]/10 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <Car size={48} className="text-[#1e3a5f] dark:text-blue-400 opacity-50" />
        </div>
        <h1 className="text-8xl font-bold text-[#1e3a5f] dark:text-blue-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
          Página no encontrada
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          La ruta que buscas no existe o fue movida.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 btn-primary px-6 py-3"
        >
          <Home size={18} />
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
