import React, { useState } from 'react';

interface LoginProps {
  alEntrar: (rol: 'ALUMNO' | 'ADMIN') => void;
  alIrARegistro: () => void;
}

export const LoginPage: React.FC<LoginProps> = ({ alEntrar, alIrARegistro }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const manejarLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const esAdmin = email.toLowerCase().endsWith('@admin.uam.mx') || email === 'admin@test.com';
    
    const rolAsignado = esAdmin ? 'ADMIN' : 'ALUMNO';

    console.log(`Verificando credenciales para: ${email}`);
    console.log(`Acceso concedido como: ${rolAsignado}`);

    alEntrar(rolAsignado);
  };

  return (
    <div style={containerStyle}>
      <div style={panelIzquierdoStyle}>
        <div style={logoStyle}>A</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Bienvenido a AbltyCheck</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
          Tu plataforma de evaluación y mejora continua en la UAM-C.
        </p>
      </div>

      <div style={panelDerechoStyle}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ color: '#1a1a1a', fontSize: '1.8rem', marginBottom: '10px' }}>Iniciar Sesión</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>Ingresa tus credenciales institucionales</p>

          <form onSubmit={manejarLogin}>
            <div style={{ marginBottom: '15px' }}>
              <label style={labelStyle}>Correo electrónico</label>
              <input 
                type="email" 
                placeholder="tu@alumnos.uam.mx" 
                style={inputStyle} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
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

            <button type="submit" style={mainButtonStyle}>
              Ingresar al Sistema
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '25px', color: '#666' }}>
            ¿No tienes cuenta? <span onClick={alIrARegistro} style={linkStyle}>Regístrate aquí</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = { display: 'flex', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, fontFamily: 'sans-serif' };
const panelIzquierdoStyle: React.CSSProperties = { flex: 1, background: 'linear-gradient(135deg, #7d5fff 0%, #a88beb 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', padding: '40px', textAlign: 'center' };
const panelDerechoStyle: React.CSSProperties = { flex: 1, backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px' };
const logoStyle = { backgroundColor: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '15px', fontSize: '30px', fontWeight: 'bold', marginBottom: '20px' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333', fontSize: '14px' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#f9f9f9', outline: 'none' };
const mainButtonStyle = { width: '100%', padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#58eb9f', color: '#1a1a1a', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' };
const linkStyle = { color: '#7d5fff', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' };