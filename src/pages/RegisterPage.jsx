import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Car } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { getErrorMessage } from '../utils/errorHandler'

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) })

  const onSubmit = async ({ firstName, lastName, email, password }) => {
    setServerError('')
    try {
      await registerUser(firstName, lastName, email, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setServerError(getErrorMessage(err))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#1e3a5f] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Car size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">MotorVault</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Crea tu cuenta</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre"
                placeholder="Juan"
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                label="Apellido"
                placeholder="Pérez"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirmar contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" loading={isSubmitting} className="w-full mt-2">
              Crear cuenta
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-[#1e3a5f] dark:text-blue-400 font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
