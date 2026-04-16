import { useState, useEffect, useCallback, useRef } from 'react'
import Papa from 'papaparse'
import { Plus, X, AlertTriangle, CheckCircle, FileSpreadsheet, ChevronDown } from 'lucide-react'
import { Navbar } from '../components/layout/Navbar'
import { VehicleList } from '../components/vehicles/VehicleList'
import { VehicleForm } from '../components/vehicles/VehicleForm'
import { SearchBar } from '../components/vehicles/SearchBar'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Toast } from '../components/ui/Toast'
import {
  getMisVehiculos,
  buscarVehiculos,
  registrarVehiculo,
  actualizarVehiculo,
  eliminarVehiculo,
} from '../api/vehicleApi'
import { getErrorMessage } from '../utils/errorHandler'

// ── CSV helpers ────────────────────────────────────────────────────────────────

const COLUMN_MAP = {
  placa: 'placa', marca: 'marca', modelo: 'modelo',
  anio: 'anio', año: 'anio', ano: 'anio', color: 'color',
}

function normalizeKey(str) {
  return str.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function parseCSVRows(results) {
  return (results.data ?? [])
    .map(raw => {
      const obj = {}
      Object.keys(raw).forEach(key => {
        const mapped = COLUMN_MAP[normalizeKey(key)]
        if (mapped) obj[mapped] = String(raw[key] ?? '').trim()
      })
      return obj
    })
    .filter(r => r.placa)
}

function downloadTemplate() {
  // BOM + punto y coma para que Excel en español abra las columnas correctamente
  const BOM = '\uFEFF'
  const csv = 'placa;marca;modelo;anio;color\nKLM345;Honda;Civic;2021;Plata\nNOP678;Ford;Fiesta;2018;Azul\n'
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'plantilla_vehiculos.csv'
  a.click()
  URL.revokeObjectURL(url)
}

// ── Drop zone ─────────────────────────────────────────────────────────────────

function CsvDropZone({ onFile }) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFile(file)
  }
  const handleInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) { onFile(file); e.target.value = '' }
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={[
        'flex flex-col items-center justify-center gap-2 py-7 px-6 rounded-xl border-2 border-dashed cursor-pointer transition-colors select-none',
        isDragging
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
          : 'border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/50 hover:border-[#1e3a5f] dark:hover:border-blue-400',
      ].join(' ')}
    >
      <FileSpreadsheet
        size={32}
        className={isDragging ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}
      />
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Arrastra tu archivo CSV o Excel
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
        o haz clic para seleccionar &nbsp;·&nbsp; Columnas: placa, marca, modelo, año, color
      </p>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); downloadTemplate() }}
        className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
      >
        Descargar plantilla CSV
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx"
        className="sr-only"
        onChange={handleInputChange}
      />
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const [vehicles, setVehicles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Toast
  const [toast, setToast] = useState(null)

  // CSV import
  const [showImportZone, setShowImportZone] = useState(false)
  const [importState, setImportState] = useState(null)

  const showToast = (message, type = 'success') => setToast({ message, type })

  const loadVehicles = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await getMisVehiculos()
      setVehicles(data.data ?? data)
    } catch (err) {
      showToast(getErrorMessage(err), 'error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadVehicles() }, [loadVehicles])

  const handleSearch = async (filtros) => {
    if (Object.keys(filtros).length === 0) { loadVehicles(); return }
    setIsSearching(true)
    try {
      const { data } = await buscarVehiculos(filtros)
      setVehicles(data.data ?? data)
    } catch (err) {
      showToast(getErrorMessage(err), 'error')
    } finally {
      setIsSearching(false)
    }
  }

  const openCreateModal = () => { setSelectedVehicle(null); setModalOpen(true) }
  const openEditModal = (vehicle) => { setSelectedVehicle(vehicle); setModalOpen(true) }

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      if (selectedVehicle) {
        await actualizarVehiculo(selectedVehicle.id, data)
        showToast('Vehículo actualizado correctamente')
      } else {
        await registrarVehiculo(data)
        showToast('Vehículo registrado correctamente')
      }
      setModalOpen(false)
      loadVehicles()
    } catch (err) {
      showToast(getErrorMessage(err), 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await eliminarVehiculo(deleteTarget.id)
      showToast('Vehículo eliminado correctamente')
      setDeleteTarget(null)
      loadVehicles()
    } catch (err) {
      showToast(getErrorMessage(err), 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  // ── CSV file handling ────────────────────────────────────────────────────────

  const handleCsvFile = (file) => {
    Papa.parse(file, {
      header: true,
      delimiter: '',        // auto-detectar coma o punto y coma
      skipEmptyLines: true,
      complete: (results) => {
        const rows = parseCSVRows(results)
        if (rows.length === 0) {
          showToast('El archivo no contiene filas válidas o las columnas no coinciden', 'error')
          return
        }
        setImportState({ phase: 'preview', rows })
        setShowImportZone(false)
      },
      error: () => showToast('Error al leer el archivo', 'error'),
    })
  }

  const handleImportConfirm = async () => {
    if (importState?.phase !== 'preview') return
    const rows = importState.rows
    const warnings = []
    setImportState({ phase: 'importing', done: 0, total: rows.length, warnings })

    for (let i = 0; i < rows.length; i++) {
      try {
        await registrarVehiculo({
          ...rows[i],
          anio: parseInt(rows[i].anio, 10),
        })
      } catch {
        warnings.push(rows[i].placa)
      }
      setImportState({ phase: 'importing', done: i + 1, total: rows.length, warnings: [...warnings] })
    }

    setImportState({ phase: 'done', total: rows.length, warnings: [...warnings] })
    loadVehicles()
  }

  const closeImportModal = () => setImportState(null)
  const isImporting = importState?.phase === 'importing'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Vehículos</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {vehicles.length} vehículo{vehicles.length !== 1 ? 's' : ''} registrado{vehicles.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImportZone(v => !v)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <FileSpreadsheet size={16} />
              Importar vehículos
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ml-0.5 ${showImportZone ? 'rotate-180' : ''}`}
              />
            </button>
            <Button onClick={openCreateModal}>
              <Plus size={18} />
              Agregar vehículo
            </Button>
          </div>
        </div>

        {/* Search */}
        <SearchBar onSearch={handleSearch} isLoading={isSearching} />

        {/* CSV drop zone — collapsible */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showImportZone ? 'max-h-64 mt-6' : 'max-h-0'
          }`}
        >
          <CsvDropZone onFile={handleCsvFile} />
        </div>

        {/* Vehicle list */}
        <div className={showImportZone ? 'mt-6' : 'mt-0'}>
          <VehicleList
            vehicles={vehicles}
            isLoading={isLoading}
            onEdit={openEditModal}
            onDelete={setDeleteTarget}
          />
        </div>

      </main>

      {/* Create / Edit modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedVehicle ? 'Editar vehículo' : 'Agregar vehículo'}
      >
        <VehicleForm
          vehicle={selectedVehicle}
          onSubmit={handleFormSubmit}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirmar eliminación"
      >
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          ¿Estás seguro de que quieres eliminar el vehículo{' '}
          <strong className="text-gray-900 dark:text-white">
            {deleteTarget?.marca} {deleteTarget?.modelo} ({deleteTarget?.placa})
          </strong>
          ? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
          <Button variant="danger" loading={isDeleting} onClick={handleDeleteConfirm}>Eliminar</Button>
        </div>
      </Modal>

      {/* CSV import modal */}
      {importState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={!isImporting ? closeImportModal : undefined}
          />
          <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-h-[90vh] flex flex-col">

            {/* Modal header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {importState.phase === 'preview'   && 'Vista previa — importación'}
                {importState.phase === 'importing' && 'Importando vehículos…'}
                {importState.phase === 'done'      && 'Importación completada'}
              </h2>
              {!isImporting && (
                <button
                  onClick={closeImportModal}
                  className="p-1 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Preview phase */}
            {importState.phase === 'preview' && (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Se importarán{' '}
                  <strong className="text-gray-800 dark:text-white">{importState.rows.length}</strong>{' '}
                  vehículo{importState.rows.length !== 1 ? 's' : ''}.
                </p>
                <div className="overflow-auto flex-1 border border-gray-200 dark:border-slate-700 rounded-lg mb-5">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-slate-700/50 sticky top-0">
                      <tr className="text-left text-gray-500 dark:text-gray-400">
                        {['Placa', 'Marca', 'Modelo', 'Año', 'Color'].map(h => (
                          <th key={h} className="px-4 py-2 font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {importState.rows.map((row, i) => (
                        <tr key={i} className="border-t border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/40">
                          <td className="px-4 py-2 font-mono text-xs font-bold text-gray-800 dark:text-white">{row.placa || '—'}</td>
                          <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.marca || '—'}</td>
                          <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.modelo || '—'}</td>
                          <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.anio || '—'}</td>
                          <td className="px-4 py-2 text-gray-700 dark:text-gray-300 capitalize">{row.color || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="secondary" onClick={closeImportModal}>Cancelar</Button>
                  <Button onClick={handleImportConfirm}>Confirmar importación</Button>
                </div>
              </>
            )}

            {/* Importing phase */}
            {importState.phase === 'importing' && (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  Importando {importState.done} de {importState.total}…
                </p>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.round((importState.done / importState.total) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {Math.round((importState.done / importState.total) * 100)}%
                </p>
              </div>
            )}

            {/* Done phase */}
            {importState.phase === 'done' && (() => {
              const ok = importState.total - importState.warnings.length
              return (
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700 dark:text-green-300">
                      <strong>{ok}</strong> vehículo{ok !== 1 ? 's' : ''} importado{ok !== 1 ? 's' : ''} correctamente.
                    </p>
                  </div>
                  {importState.warnings.length > 0 && (
                    <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <AlertTriangle size={20} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-700 dark:text-yellow-300">
                        <p className="font-medium mb-1">
                          {importState.warnings.length} vehículo{importState.warnings.length !== 1 ? 's' : ''} no se pudo{importState.warnings.length !== 1 ? 'ieron' : ''} importar:
                        </p>
                        <p className="font-mono text-xs">{importState.warnings.join(', ')}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <Button onClick={closeImportModal}>Cerrar</Button>
                  </div>
                </div>
              )
            })()}

          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
