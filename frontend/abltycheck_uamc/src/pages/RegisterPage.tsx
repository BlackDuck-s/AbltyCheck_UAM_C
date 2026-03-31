import React, { useState } from 'react';
import api from '../config/axiosConfig';

interface RegisterProps {
  alFinalizar: () => void;
  alIrALogin: () => void;
}

export const RegisterPage: React.FC<RegisterProps> = ({ alFinalizar, alIrALogin }) => {
  // Añadimos el campo matrícula (vital para su sistema)
  const [datos, setDatos] = useState({ 
    matricula: '', 
    nombre: '', 
    email: '', // Cambiado de 'email' a 'correo' para cuadrar con tu backend
    password: '', 
    rol: 'ALUMNO' 
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Hacemos el POST a tu Spring Boot para crear el usuario en Firebase
      await api.post('/auth/register', datos);
      
      alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
      alIrALogin(); // Los mandamos directo al login para que prueben sus credenciales

    } catch (err: any) {
      console.error("Error al registrar:", err);
      // Mostramos el mensaje de error que mande tu Spring Boot (ej: "La matrícula ya existe")
      setError(err.response?.data?.mensaje || 'Error al conectar con el servidor para el registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      {/* PANEL IZQUIERDO */}
      <div style={panelIzquierdoStyle}>
        <div style={logoStyle}>A</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Únete a AbltyCheck</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
          Crea tu perfil para empezar a proponer reactivos y mejorar tus habilidades.
        </p>
      </div>

      {/* PANEL DERECHO */}
      <div style={panelDerechoStyle}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ color: '#1a1a1a', fontSize: '1.8rem', marginBottom: '10px' }}>Crear nueva cuenta</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>Regístrate con tu correo institucional UAM</p>

          <form onSubmit={manejarRegistro}>
            <div style={{ marginBottom: '15px' }}>
              <label style={labelStyle}>Matrícula</label>
              <input 
                type="text" 
                placeholder="Ej. 2193000000" 
                style={inputStyle} 
                value={datos.matricula}
                onChange={(e) => setDatos({...datos, matricula: e.target.value})}
                required 
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={labelStyle}>Nombre Completo</label>
              <input 
                type="text" 
                placeholder="Ej. Max" 
                style={inputStyle} 
                value={datos.nombre}
                onChange={(e) => setDatos({...datos, nombre: e.target.value})}
                required 
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={labelStyle}>Correo electrónico</label>
              <input 
                type="email" 
                placeholder="tu@alumnos.uam.mx" 
                style={inputStyle} 
                value={datos.email}
                onChange={(e) => setDatos({...datos, email: e.target.value})}
                required 
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Contraseña</label>
              <input 
                type="password" 
                placeholder="Crea una contraseña segura" 
                style={inputStyle} 
                value={datos.password}
                onChange={(e) => setDatos({...datos, password: e.target.value})}
                required 
              />
            </div>

            {/* Mensaje de error dinámico */}
            {error && (
              <div style={{ color: '#e74c3c', marginBottom: '20px', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{...mainButtonStyle, opacity: loading ? 0.7 : 1}}>
              {loading ? 'Creando cuenta...' : 'Registrar Cuenta'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '25px', color: '#666' }}>
            ¿Ya tienes cuenta? <span onClick={alIrALogin} style={linkStyle}>Inicia sesión aquí</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// ... (Estilos CSS originales intactos) ...
const containerStyle: React.CSSProperties = { display: 'flex', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, fontFamily: 'sans-serif' };
const panelIzquierdoStyle: React.CSSProperties = { flex: 1, background: 'linear-gradient(135deg, #7d5fff 0%, #a88beb 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', padding: '40px', textAlign: 'center' };
const panelDerechoStyle: React.CSSProperties = { flex: 1, backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px' };
const logoStyle = { backgroundColor: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '15px', fontSize: '30px', fontWeight: 'bold', marginBottom: '20px' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333', fontSize: '14px' };
const inputStyle: React.CSSProperties = { 
  width: '100%', 
  padding: '12px', // En el Login creo que tenías 15px, puedes dejar el que prefieras
  borderRadius: '10px', 
  border: '1px solid #ddd', 
  backgroundColor: '#f9f9f9', 
  boxSizing: 'border-box',
  color: '#333' // <-- ¡Esta es la línea mágica que te devolverá la vista!
};
const mainButtonStyle = { width: '100%', padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#58eb9f', color: '#1a1a1a', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' };
const linkStyle = { color: '#7d5fff', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' };