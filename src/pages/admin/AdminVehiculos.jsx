import { useState, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { getVehiculos, eliminarVehiculo } from '../../api/adminApi'
import { VehiculosTable } from '../../components/admin/VehiculosTable'
import { Toast } from '../../components/ui/Toast'

const INITIAL_FILTROS = { placa: '', marca: '', anio: '', desde: '', hasta: '' }

function FilterInput({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="min-w-[130px]">
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

export function AdminVehiculos() {
  const [vehiculos, setVehiculos] = useState([])
  const [loading, setLoading]     = useState(true)
  const [toast, setToast]         = useState(null)
  const [filtros, setFiltros]     = useState(INITIAL_FILTROS)
  const [formFiltros, setFormFiltros] = useState(INITIAL_FILTROS)

  const fetchVehiculos = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await getVehiculos(filtros)
      const payload = data.data ?? data
      setVehiculos(Array.isArray(payload) ? payload : (payload.content ?? payload.vehiculos ?? []))
    } catch {
      setToast({ message: 'Error al cargar vehículos', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [filtros])

  useEffect(() => { fetchVehiculos() }, [fetchVehiculos])

  const handleBuscar = (e) => {
    e.preventDefault()
    setFiltros({ ...formFiltros })
  }

  const handleLimpiar = () => {
    setFormFiltros(INITIAL_FILTROS)
    setFiltros(INITIAL_FILTROS)
  }

  const updateForm = (key) => (e) =>
    setFormFiltros(f => ({ ...f, [key]: e.target.value }))

  const handleEliminar = async (vehiculo) => {
    const placa = vehiculo.placa ?? vehiculo.licensePlate ?? vehiculo.id
    if (!window.confirm(`¿Eliminar el vehículo de placa "${placa}"?\nEsta acción no se puede deshacer.`)) return
    try {
      await eliminarVehiculo(vehiculo.id)
      setToast({ message: 'Vehículo eliminado correctamente', type: 'success' })
      fetchVehiculos()
    } catch {
      setToast({ message: 'Error al eliminar el vehículo', type: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Vehículos</h1>

      {/* ── Filters ── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4">
        <form onSubmit={handleBuscar} className="flex flex-wrap items-end gap-3">
          <FilterInput label="Placa"  value={formFiltros.placa}  onChange={updateForm('placa')}  placeholder="ABC123" />
          <FilterInput label="Marca"  value={formFiltros.marca}  onChange={updateForm('marca')}  placeholder="Toyota" />
          <FilterInput label="Año"    value={formFiltros.anio}   onChange={updateForm('anio')}   placeholder="2022" type="number" />
          <FilterInput label="Desde"  value={formFiltros.desde}  onChange={updateForm('desde')}  type="date" />
          <FilterInput label="Hasta"  value={formFiltros.hasta}  onChange={updateForm('hasta')}  type="date" />
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
        <VehiculosTable
          vehiculos={vehiculos}
          onEliminar={handleEliminar}
          loading={loading}
        />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
