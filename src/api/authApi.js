import axiosInstance from './axiosConfig'

export const loginApi = (email, password) =>
  axiosInstance.post('/api/auth/login', { email, password })

export const registerApi = (firstName, lastName, email, password) =>
  axiosInstance.post('/api/auth/register', { firstName, lastName, email, password })
