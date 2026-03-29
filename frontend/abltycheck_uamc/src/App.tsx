import { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ReactivoForm } from './pages/ReactivoForm';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { EntrenamientoPage } from './pages/EntrenamientoPage';

function App() {
  // --- ESTADOS DE FLUJO ---
  // rol: ALUMNO o ADMIN (Simula la decodificación del JWT que configuró Max)
  const [rol, setRol] = useState<'ALUMNO' | 'ADMIN' | null>(null);
  
  // vistaAuth: Controla si estamos en Login o Registro
  const [vistaAuth, setVistaAuth] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  
  // vista: Controla la sección activa dentro del Dashboard
  const [vista, setVista] = useState<'FORM' | 'ADMIN' | 'EXAMEN'>('EXAMEN');
  
  // sidebarAbierta: Maneja el estado del menú lateral "escondible"
  const [sidebarAbierta, setSidebarAbierta] = useState(true);

  // --- FUNCIONES DE NAVEGACIÓN ---
  const manejarLogin = (nuevoRol: 'ALUMNO' | 'ADMIN') => {
    setRol(nuevoRol);
    // Redirección automática: Admin va a su panel, Alumno a entrenar
    setVista(nuevoRol === 'ADMIN' ? 'ADMIN' : 'EXAMEN');
  };

  // --- RENDERIZADO CONDICIONAL (FLUJO DE AUTENTICACIÓN) ---
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

  // --- RENDERIZADO DEL DASHBOARD PRINCIPAL (POST-LOGIN) ---
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR IZQUIERDA (Menú que se esconde) */}
      <aside style={{
        width: sidebarAbierta ? '260px' : '80px',
        backgroundColor: '#7d5fff',
        color: 'white',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 10px',
        boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Botón Toggle para esconder/mostrar la barra */}
        <button 
          onClick={() => setSidebarAbierta(!sidebarAbierta)}
          style={toggleBtnStyle}
        >
          {sidebarAbierta ? '◀' : '▶'}
        </button>

        <div style={{ textAlign: 'center', marginBottom: '40px', fontWeight: 'bold', fontSize: '22px' }}>
          {sidebarAbierta ? 'AbltyCheck' : 'A'}
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          <button onClick={() => setVista('EXAMEN')} style={sideBtnStyle(vista === 'EXAMEN', sidebarAbierta)}>
            {sidebarAbierta ? '📝 Entrenamiento' : '📝'}
          </button>
          
          <button onClick={() => setVista('FORM')} style={sideBtnStyle(vista === 'FORM', sidebarAbierta)}>
            {sidebarAbierta ? '➕ Crowdsourcing' : '➕'}
          </button>
          
          {/* PROTECCIÓN DE RUTAS: Solo el rol ADMIN ve esta opción */}
          {rol === 'ADMIN' && (
            <button onClick={() => setVista('ADMIN')} style={sideBtnStyle(vista === 'ADMIN', sidebarAbierta)}>
              {sidebarAbierta ? '🛡️ Panel Admin' : '🛡️'}
            </button>
          )}
        </nav>

        {/* Botón de Salida */}
        <button 
          onClick={() => { setRol(null); setVistaAuth('LOGIN'); }} 
          style={{ ...sideBtnStyle(false, sidebarAbierta), backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 'auto' }}
        >
          {sidebarAbierta ? '🚪 Cerrar Sesión' : '🚪'}
        </button>
      </aside>

      {/* ÁREA DE CONTENIDO (Sección Dinámica) */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <header style={{ marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, color: '#1a1a1a', fontSize: '24px' }}>
              {vista === 'EXAMEN' && 'Módulo de Entrenamiento'}
              {vista === 'FORM' && 'Proponer Nueva Evaluación'}
              {vista === 'ADMIN' && 'Panel de Administración y Moderación'}
            </h2>
            <p style={{ color: '#666', margin: '5px 0 0 0' }}>Conectado como: <strong style={{color: '#7d5fff'}}>{rol}</strong></p>
          </div>
          <div style={{ fontSize: '12px', color: '#aaa', textAlign: 'right' }}>
            UAM Cuajimalpa<br/>Ingeniería en Computación
          </div>
        </header>

        {/* INYECCIÓN DE COMPONENTES SEGÚN LA VISTA SELECCIONADA */}
        <div style={{ maxWidth: '1000px', animation: 'fadeIn 0.5s' }}>
          {vista === 'EXAMEN' && <EntrenamientoPage />}
          {vista === 'FORM' && <ReactivoForm />}
          {vista === 'ADMIN' && rol === 'ADMIN' && <AdminDashboardPage />}
        </div>
      </main>
    </div>
  );
}

// --- ESTILOS INTERNOS (CSS-in-JS) ---
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
  gap: '12px'
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
  fontWeight: 'bold',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#1a1a1a'
};

export default App;