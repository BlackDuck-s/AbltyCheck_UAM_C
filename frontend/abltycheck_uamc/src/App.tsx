import { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ReactivoForm } from './pages/ReactivoForm';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { EntrenamientoPage } from './pages/EntrenamientoPage';
import { PracticarPage } from './pages/PracticarPage';

function App() {
  const [rol, setRol] = useState<'ALUMNO' | 'ADMIN' | null>(null);
  const [vistaAuth, setVistaAuth] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [vista, setVista] = useState<'EXAMEN' | 'PRACTICAR' | 'FORM' | 'ADMIN'>('EXAMEN');
  const [sidebarAbierta, setSidebarAbierta] = useState(true);

  const manejarLogin = (nuevoRol: 'ALUMNO' | 'ADMIN') => {
    setRol(nuevoRol);
    setVista(nuevoRol === 'ADMIN' ? 'ADMIN' : 'EXAMEN');
  };

  if (!rol) {
    return vistaAuth === 'LOGIN' ? (
      <LoginPage 
        alEntrar={manejarLogin} 
        alIrARegistro={() => setVistaAuth('REGISTER')} 
      />
    ) : (
      <RegisterPage 
        alFinalizar={() => setVistaAuth('LOGIN')} 
        alIrALogin={() => setVistaAuth('LOGIN')} 
      />
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'sans-serif' }}>
      
      {}
      <aside style={{
        width: sidebarAbierta ? '260px' : '80px',
        backgroundColor: '#7d5fff',
        color: 'white',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 10px',
        boxShadow: '4px 0 15px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 100
      }}>
        {}
        <button 
          onClick={() => setSidebarAbierta(!sidebarAbierta)}
          style={toggleBtnStyle}
        >
          {sidebarAbierta ? '◀' : '▶'}
        </button>

        <div style={{ textAlign: 'center', marginBottom: '40px', fontWeight: 'bold', fontSize: '22px' }}>
          {sidebarAbierta ? 'AbltyCheck' : 'A'}
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <button onClick={() => setVista('EXAMEN')} style={sideBtnStyle(vista === 'EXAMEN', sidebarAbierta)}>
             {sidebarAbierta ? '🏠 Mi Panel' : '🏠'}
          </button>

          <button onClick={() => setVista('PRACTICAR')} style={sideBtnStyle(vista === 'PRACTICAR', sidebarAbierta)}>
             {sidebarAbierta ? '📖 Practicar' : '📖'}
          </button>
          
          <button onClick={() => setVista('FORM')} style={sideBtnStyle(vista === 'FORM', sidebarAbierta)}>
             {sidebarAbierta ? '➕ Crowdsourcing' : '➕'}
          </button>
          
          {}
          {rol === 'ADMIN' && (
            <button onClick={() => setVista('ADMIN')} style={sideBtnStyle(vista === 'ADMIN', sidebarAbierta)}>
               {sidebarAbierta ? '🛡️ Panel Admin' : '🛡️'}
            </button>
          )}
        </nav>

        {}
        <button 
          onClick={() => { setRol(null); setVistaAuth('LOGIN'); }} 
          style={{ ...sideBtnStyle(false, sidebarAbierta), backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 'auto' }}
        >
          {sidebarAbierta ? '🚪 Cerrar Sesión' : '🚪'}
        </button>
      </aside>

      {}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <header style={{ 
          marginBottom: '30px', 
          borderBottom: '2px solid #eee', 
          paddingBottom: '20px', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center' 
        }}>
          <div>
            <h2 style={{ margin: 0, color: '#1a1a1a' }}>
              {vista === 'EXAMEN' && 'Panel de Actividad'}
              {vista === 'PRACTICAR' && 'Explorar Evaluaciones'}
              {vista === 'FORM' && 'Colaboración (Crowdsourcing)'}
              {vista === 'ADMIN' && 'Moderación de Contenido'}
            </h2>
            <p style={{ color: '#666', margin: '5px 0 0 0' }}>
              Rol: <strong style={{color: '#7d5fff'}}>{rol}</strong> | UAM Cuajimalpa
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '12px', color: '#999' }}>
            {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </header>

        {}
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {vista === 'EXAMEN' && <EntrenamientoPage />}
          {vista === 'PRACTICAR' && <PracticarPage />}
          {vista === 'FORM' && <ReactivoForm />}
          {vista === 'ADMIN' && rol === 'ADMIN' && <AdminDashboardPage />}
        </div>
      </main>
    </div>
  );
}

const sideBtnStyle = (activo: boolean, abierta: boolean) => ({
  width: '100%',
  padding: '14px',
  cursor: 'pointer',
  backgroundColor: activo ? 'rgba(255,255,255,0.25)' : 'transparent',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  textAlign: abierta ? 'left' as const : 'center' as const,
  fontWeight: 'bold' as const,
  fontSize: '15px',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  whiteSpace: 'nowrap' as const,
  overflow: 'hidden'
});

const toggleBtnStyle: React.CSSProperties = {
  position: 'absolute',
  right: '-15px',
  top: '25px',
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: '#58eb9f',
  cursor: 'pointer',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#1a1a1a',
  fontWeight: 'bold'
};

export default App;