import axiosInstance from './axiosConfig'

export const getStats = () =>
  axiosInstance.get('/api/v1/admin/stats')

export const getUsuarios = (busqueda = '', activo = '') =>
  axiosInstance.get('/api/v1/admin/usuarios', {
    params: {
      ...(busqueda ? { busqueda } : {}),
      ...(activo !== '' ? { activo } : {}),
    },
  })

export const toggleUsuario = (id) =>
  axiosInstance.patch(`/api/v1/admin/usuarios/${id}/toggle`)

export const cambiarRol = (id, role) =>
  axiosInstance.patch(`/api/v1/admin/usuarios/${id}/rol`, { role })

export const getVehiculos = (filtros = {}) =>
  axiosInstance.get('/api/v1/admin/vehiculos', {
    params: Object.fromEntries(
      Object.entries(filtros).filter(([, v]) => v !== '' && v != null)
    ),
  })

export const eliminarVehiculo = (id) =>
  axiosInstance.delete(`/api/v1/admin/vehiculos/${id}`)

export const getLogs = (filtros = {}) =>
  axiosInstance.get('/api/v1/admin/logs', {
    params: Object.fromEntries(
      Object.entries(filtros).filter(([, v]) => v !== '' && v != null)
    ),
  })
