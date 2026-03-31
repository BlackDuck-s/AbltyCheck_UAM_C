import { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { EntrenamientoPage } from './pages/EntrenamientoPage';
import { PracticarPage } from './pages/PracticarPage';
import { ReactivoForm } from './pages/ReactivoForm';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function App() {
  const [rol, setRol] = useState<'ALUMNO' | 'ADMIN' | null>(null);
  const [vistaAuth, setVistaAuth] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [vista, setVista] = useState<'PANEL' | 'PRACTICAR' | 'CROWD' | 'ADMIN'>('PANEL');

  if (!rol) {
    return vistaAuth === 'LOGIN' 
      ? <LoginPage alEntrar={(r) => { setRol(r); setVista(r === 'ADMIN' ? 'ADMIN' : 'PANEL'); }} alIrARegistro={() => setVistaAuth('REGISTER')} />
      : <RegisterPage alFinalizar={() => setVistaAuth('LOGIN')} alIrALogin={() => setVistaAuth('LOGIN')} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f4f7f6' }}>
      
      {/* SIDEBAR FIJA */}
      <aside style={{ 
        width: '260px', 
        minWidth: '260px', 
        backgroundColor: '#7d5fff', 
        padding: '20px', 
        display: 'flex', 
        flexDirection: 'column', 
        boxSizing: 'border-box',
        height: '100vh'
      }}>
        <h2 style={{ textAlign: 'center', color: 'white', marginBottom: '40px' }}>AbltyCheck</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          <button onClick={() => setVista('PANEL')} style={navBtnStyle(vista === 'PANEL')}>🏠 Mi Panel</button>
          <button onClick={() => setVista('PRACTICAR')} style={navBtnStyle(vista === 'PRACTICAR')}>📖 Practicar</button>
          <button onClick={() => setVista('CROWD')} style={navBtnStyle(vista === 'CROWD')}>➕ Colaborar</button>
          {rol === 'ADMIN' && (
            <button onClick={() => setVista('ADMIN')} style={navBtnStyle(vista === 'ADMIN')}>🛡️ Panel Admin</button>
          )}
        </nav>
        <button onClick={() => setRol(null)} style={logoutBtnStyle}>Cerrar Sesión</button>
      </aside>

      {/* CONTENIDO PRINCIPAL SCROLLEABLE */}
      <main style={{ 
        flex: 1, 
        height: '100vh', 
        overflowY: 'auto', 
        padding: '40px', 
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ width: '100%', maxWidth: '1200px' }}>
          {vista === 'PANEL' && <EntrenamientoPage />}
          {vista === 'PRACTICAR' && <PracticarPage />}
          {vista === 'CROWD' && <ReactivoForm />}
          {vista === 'ADMIN' && rol === 'ADMIN' && <AdminDashboardPage />}
        </div>
      </main>
    </div>
  );
}

const navBtnStyle = (activo: boolean) => ({
  backgroundColor: activo ? 'rgba(255,255,255,0.2)' : 'transparent',
  color: 'white',
  border: 'none',
  padding: '12px 15px',
  borderRadius: '10px',
  textAlign: 'left' as const,
  cursor: 'pointer',
  fontWeight: 'bold' as const,
  fontSize: '15px',
  width: '100%',
  transition: '0.2s'
});

const logoutBtnStyle = {
  backgroundColor: 'rgba(0,0,0,0.1)',
  color: 'white',
  border: 'none',
  padding: '12px',
  borderRadius: '10px',
  cursor: 'pointer',
  width: '100%',
  fontWeight: 'bold' as const
};

export default App;