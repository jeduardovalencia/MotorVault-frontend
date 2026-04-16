import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

const emptyFilters = { placa: '', marca: '', modelo: '', año: '' }

export function SearchBar({ onSearch, isLoading }) {
  const [filters, setFilters] = useState(emptyFilters)

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Only send non-empty filters
    const active = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '')
    )
    onSearch(active)
  }

  const handleClear = () => {
    setFilters(emptyFilters)
    onSearch({})
  }

  const hasFilters = Object.values(filters).some((v) => v !== '')

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-4 mb-6"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        <Input
          name="placa"
          placeholder="Placa"
          value={filters.placa}
          onChange={handleChange}
        />
        <Input
          name="marca"
          placeholder="Marca"
          value={filters.marca}
          onChange={handleChange}
        />
        <Input
          name="modelo"
          placeholder="Modelo"
          value={filters.modelo}
          onChange={handleChange}
        />
        <Input
          name="año"
          placeholder="Año"
          type="number"
          value={filters.año}
          onChange={handleChange}
        />
      </div>
      <div className="flex gap-2 justify-end">
        {hasFilters && (
          <Button type="button" variant="secondary" onClick={handleClear}>
            <X size={16} />
            Limpiar
          </Button>
        )}
        <Button type="submit" loading={isLoading}>
          <Search size={16} />
          Buscar
        </Button>
      </div>
    </form>
  )
}
