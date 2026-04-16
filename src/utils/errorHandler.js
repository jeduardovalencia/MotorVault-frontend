/**
 * Parses API errors and returns a human-readable message.
 * Handles 400 (validation), 401 (auth), 403 (forbidden), 500 (server).
 */
export const getErrorMessage = (error) => {
  const status = error?.response?.status
  const data = error?.response?.data

  switch (status) {
    case 400: {
      // Try to extract validation messages from backend response
      if (data?.message) return data.message
      if (data?.errors && Array.isArray(data.errors)) return data.errors.join(', ')
      if (typeof data === 'string') return data
      return 'Datos inválidos. Revisa los campos e intenta de nuevo.'
    }
    case 401:
      return 'Sesión expirada. Por favor inicia sesión de nuevo.'
    case 403:
      return 'No tienes permisos para realizar esta acción.'
    case 404:
      return 'El recurso solicitado no fue encontrado.'
    case 500:
      return 'Error del servidor, intenta más tarde.'
    default:
      if (!error.response) return 'Error de conexión. Verifica tu internet.'
      return data?.message || 'Ocurrió un error inesperado.'
  }
}
