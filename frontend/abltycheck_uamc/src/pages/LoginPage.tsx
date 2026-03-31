import React, { useState } from 'react';
import api from '../config/axiosConfig';

interface LoginProps {
  alEntrar: (rol: 'ALUMNO' | 'ADMIN') => void;
  alIrARegistro: () => void;
}

export const LoginPage: React.FC<LoginProps> = ({ alEntrar, alIrARegistro }) => {
  // 1. Cambiamos el estado de 'email' a 'matricula'
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { 
        matricula: matricula, // 2. ¡Ahora enviamos la matrícula para que Spring Boot sea feliz!
        password: password 
      });

      const { token, rol } = response.data; 
      localStorage.setItem('jwt_token', token);
      alEntrar(rol as 'ALUMNO' | 'ADMIN');

    } catch (err: any) {
      console.error("Error en el login:", err);
      setError(err.response?.data?.mensaje || 'Credenciales inválidas o matrícula no encontrada.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
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

      <div style={panelDerechoStyle}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ color: '#1a1a1a', fontSize: '2.2rem', marginBottom: '10px' }}>¡Bienvenido de vuelta!</h2>
          <p style={{ color: '#666', marginBottom: '40px' }}>Inicia sesión para continuar practicando</p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              {/* 3. Cambiamos el label y el input para pedir Matrícula */}
              <label style={labelStyle}>Matrícula Universitaria</label>
              <input 
                type="text" 
                required
                placeholder="Ej. 2193000000" 
                style={inputStyle}
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={labelStyle}>Contraseña</label>
              <input 
                type="password" 
                required
                placeholder="••••••••" 
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div style={{ color: '#e74c3c', marginBottom: '20px', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                type="submit" 
                disabled={loading}
                style={{ ...mainButtonStyle, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Conectando con Servidor...' : 'Iniciar Sesión'}
              </button>
            </div>
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

// ... (Estilos CSS intactos) ...
const containerStyle: React.CSSProperties = { display: 'flex', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, fontFamily: 'system-ui, -apple-system, sans-serif' };
const panelIzquierdoStyle: React.CSSProperties = { flex: 1.2, background: 'linear-gradient(135deg, #a88beb 0%, #7d5fff 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', padding: '60px', textAlign: 'center' };
const panelDerechoStyle: React.CSSProperties = { flex: 1, backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px' };
const logoWrapperStyle: React.CSSProperties = { backgroundColor: 'rgba(255,255,255,0.2)', width: '80px', height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '20px', fontSize: '40px', fontWeight: 'bold', marginBottom: '30px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' };
const badgeStyle: React.CSSProperties = { backgroundColor: 'rgba(255,255,255,0.15)', padding: '10px 20px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: '500', backdropFilter: 'blur(5px)' };
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#444', fontSize: '14px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#f9f9f9', boxSizing: 'border-box', color: '#333' };
const mainButtonStyle: React.CSSProperties = { width: '100%', padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: '#58eb9f', color: '#1a1a1a', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s, opacity 0.2s' };
const linkStyle: React.CSSProperties = { color: '#7d5fff', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none' };