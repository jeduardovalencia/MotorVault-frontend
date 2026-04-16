import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ImagePlus, X } from 'lucide-react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

const MAX_SIZE_BYTES = 2 * 1024 * 1024 // 2 MB

const vehicleSchema = z.object({
  placa: z
    .string()
    .min(1, 'La placa es requerida')
    .max(20)
    .regex(/^[A-Za-z0-9-]+$/, 'Solo letras, números y guiones'),
  marca: z.string().min(1, 'La marca es requerida'),
  modelo: z.string().min(1, 'El modelo es requerido'),
  anio: z
    .number({ invalid_type_error: 'El año debe ser un número' })
    .int()
    .min(1900, 'Año inválido')
    .max(new Date().getFullYear() + 1, 'Año inválido'),
  color: z.string().min(1, 'El color es requerido'),
  fotoUrl: z.string().optional(),
})

export function VehicleForm({ vehicle, onSubmit, isLoading }) {
  const isEditing = !!vehicle

  // preview holds the base64 string (or existing URL in edit mode)
  const [preview, setPreview] = useState(null)
  const [imageError, setImageError] = useState('')
  const fileInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      placa: '',
      marca: '',
      modelo: '',
      anio: new Date().getFullYear(),
      color: '',
      fotoUrl: '',
    },
  })

  useEffect(() => {
    if (vehicle) {
      reset({
        placa: vehicle.placa || '',
        marca: vehicle.marca || '',
        modelo: vehicle.modelo || '',
        anio: vehicle.anio || new Date().getFullYear(),
        color: vehicle.color || '',
        fotoUrl: vehicle.fotoUrl || '',
      })
      setPreview(vehicle.fotoUrl || null)
    } else {
      reset({ placa: '', marca: '', modelo: '', anio: new Date().getFullYear(), color: '', fotoUrl: '' })
      setPreview(null)
    }
    setImageError('')
  }, [vehicle, reset])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageError('')

    if (file.size > MAX_SIZE_BYTES) {
      setImageError('La imagen no puede superar los 2 MB.')
      // reset the native input so the user can pick again
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = ev.target.result
      setPreview(base64)
      setValue('fotoUrl', base64, { shouldValidate: true })
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setPreview(null)
    setValue('fotoUrl', '', { shouldValidate: true })
    setImageError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFormSubmit = (data) => {
    const payload = {
      ...data,
      anio: parseInt(data.anio, 10),
    }
    if (!payload.fotoUrl) delete payload.fotoUrl
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Placa *"
          placeholder="ABC-123"
          error={errors.placa?.message}
          {...register('placa', {
            onChange: (e) => {
              e.target.value = e.target.value.toUpperCase()
            },
          })}
        />
        <Input
          label="Marca *"
          placeholder="Toyota"
          error={errors.marca?.message}
          {...register('marca')}
        />
        <Input
          label="Modelo *"
          placeholder="Corolla"
          error={errors.modelo?.message}
          {...register('modelo')}
        />
        <Input
          label="Año *"
          type="number"
          placeholder="2024"
          error={errors.anio?.message}
          {...register('anio', { valueAsNumber: true })}
        />
        <Input
          label="Color *"
          placeholder="Blanco"
          error={errors.color?.message}
          {...register('color')}
        />
      </div>

      {/* Image upload */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Foto del vehículo (opcional)
        </label>

        {preview ? (
          <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-slate-600">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-40 object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              aria-label="Quitar imagen"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-2 h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/50 cursor-pointer hover:border-[#1e3a5f] dark:hover:border-blue-400 transition-colors">
            <ImagePlus size={28} className="text-gray-400 dark:text-gray-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Haz clic para seleccionar una imagen
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">PNG, JPG, WEBP — máx. 2 MB</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>
        )}

        {imageError && (
          <span className="text-xs text-red-500">{imageError}</span>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={isLoading} className="min-w-[140px]">
          {isEditing ? 'Guardar cambios' : 'Registrar vehículo'}
        </Button>
      </div>
    </form>
  )
}
