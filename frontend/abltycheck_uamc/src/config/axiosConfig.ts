import axios, { type InternalAxiosRequestConfig } from 'axios';

// Creamos una instancia configurada de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor: Antes de que salga cualquier petición, revisamos si ya tenemos un Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('jwt_token');
    
    // Si hay token y los headers existen, inyectamos el JWT
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  }, 
  (error: any) => {
    return Promise.reject(error);
  }
);

export default api;