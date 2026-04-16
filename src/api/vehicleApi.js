import axiosInstance from './axiosConfig'

export const getMisVehiculos = () =>
  axiosInstance.get('/api/v1/vehicles/mis-vehiculos')

export const buscarVehiculos = (filtros) =>
  axiosInstance.get('/api/v1/vehicles/buscar', { params: filtros })

export const registrarVehiculo = (data) =>
  axiosInstance.post('/api/v1/vehicles', data)

export const actualizarVehiculo = (id, data) =>
  axiosInstance.put(`/api/v1/vehicles/${id}`, data)

export const eliminarVehiculo = (id) =>
  axiosInstance.delete(`/api/v1/vehicles/${id}`)
