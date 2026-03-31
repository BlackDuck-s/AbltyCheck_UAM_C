import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

interface LoginProps {
  alEntrar?: (rol: 'ALUMNO' | 'ADMIN') => void; // Lo dejamos opcional para no romper App.tsx
  alIrARegistro: () => void;
}

export const LoginPage: React.FC<LoginProps> = ({ alIrARegistro }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Traemos tu estado global y el enrutador
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  // --- TU LÓGICA DE CONEXIÓN REAL ---
  const manejarLoginReal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      // 1. Hacemos la petición POST al backend de Emilio
      const response = await api.post('/auth/login', { email, password });
      
      // 2. Tu Zustand guarda el token JWT y decodifica si es ALUMNO o MODERADOR
      setToken(response.data.token);
      
      // 3. Lo mandamos al panel (Tus rutas protegidas lo llevarán a donde pertenece)
      navigate('/');
      
    } catch (err) {
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={containerStyle}>
      {/* SECCIÓN IZQUIERDA: Panel Informativo (Brand Panel) */}
      <div style={panelIzquierdoStyle}>
        <div style={logoWrapperStyle}>A</div>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px', fontWeight: 'bold' }}>AbltyCheck</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '80%' }}>
          Practica, aprende y domina tus materias universitarias de forma divertida.
        </p>
        
        <div style={{ display: 'flex', gap: '15px', marginTop: '40px' }}>
          <span style={badgeStyle}>📊 +500 preguntas</span>
          <span style={badgeStyle}>🎯 6 áreas</span>
        </div>
      </div>

      {/* SECCIÓN DERECHA: Formulario de Acceso Conectado */}
      <div style={panelDerechoStyle}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ color: '#1a1a1a', fontSize: '2.2rem', marginBottom: '10px' }}>¡Bienvenido de vuelta!</h2>
          <p style={{ color: '#666', marginBottom: '40px' }}>Inicia sesión para continuar practicando</p>

          {/* Formulario real que ejecuta tu petición Axios */}
          <form onSubmit={manejarLoginReal}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Correo electrónico</label>
              <input 
                type="email" 
                placeholder="tu@universidad.edu" 
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={labelStyle}>Contraseña</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Mensaje de error si el backend rechaza las credenciales */}
            {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}

            {/* BOTÓN ÚNICO Y SEGURO */}
            <button 
              type="submit" 
              style={{...mainButtonStyle, opacity: cargando ? 0.7 : 1}}
              disabled={cargando}
            >
              {cargando ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '30px', color: '#666' }}>
            ¿No tienes cuenta? <span onClick={alIrARegistro} style={linkStyle}>Crear nueva cuenta →</span>
          </p>
          
          <p style={{ marginTop: '50px', fontSize: '11px', textAlign: 'center', color: '#bbb' }}>
            Prototipo v3.0 | Ingeniería en Computación UAM-C 
          </p>
        </div>
      </div>
    </div>
  );
};

// --- OBJETOS DE ESTILO (CSS-in-JS de Edgar Intactos) ---
const containerStyle: React.CSSProperties = { display: 'flex', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, fontFamily: 'system-ui, -apple-system, sans-serif' };
const panelIzquierdoStyle: React.CSSProperties = { flex: 1.2, background: 'linear-gradient(135deg, #a88beb 0%, #7d5fff 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', padding: '60px', textAlign: 'center' };
const panelDerechoStyle: React.CSSProperties = { flex: 1, backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px' };
const logoWrapperStyle: React.CSSProperties = { backgroundColor: 'rgba(255,255,255,0.2)', width: '80px', height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '20px', fontSize: '40px', fontWeight: 'bold', marginBottom: '30px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' };
const badgeStyle: React.CSSProperties = { backgroundColor: 'rgba(255,255,255,0.15)', padding: '10px 20px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: '500', backdropFilter: 'blur(5px)' };
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#444', fontSize: '14px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #eee', backgroundColor: '#f9f9f9', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' };
const mainButtonStyle: React.CSSProperties = { width: '100%', padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: '#58eb9f', color: '#1a1a1a', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s, opacity 0.2s' };
const linkStyle: React.CSSProperties = { color: '#7d5fff', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none' };