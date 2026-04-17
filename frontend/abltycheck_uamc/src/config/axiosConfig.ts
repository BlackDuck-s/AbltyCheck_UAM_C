import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // Asegúrate de que sea tu URL real
});

// 1. Interceptor de Petición (El que ya debías tener para inyectar el Token)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 2. Interceptor de Respuesta (LA MAGIA PARA EL TOKEN EXPIRADO)
api.interceptors.response.use(
    (response) => {
        // Si todo sale bien (200 OK), dejamos pasar la respuesta
        return response;
    },
    (error) => {
        // Si el backend nos manda un 401 (No Autorizado) o 403 (Prohibido)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn("Token expirado o inválido. Cerrando sesión por seguridad...");

            // Borramos el token zombi
            localStorage.removeItem('jwt_token');

            // Redirigimos al Login usando el objeto window (ya que aquí no sirve useNavigate)
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;