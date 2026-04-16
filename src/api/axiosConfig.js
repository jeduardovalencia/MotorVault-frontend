import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('motorvault-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: handle 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginEndpoint = error.config?.url?.includes('/auth/login') ||
                            error.config?.url?.includes('/auth/register')

    if (error.response?.status === 401 && !isLoginEndpoint) {
      localStorage.removeItem('motorvault-token')
      localStorage.removeItem('motorvault-user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
