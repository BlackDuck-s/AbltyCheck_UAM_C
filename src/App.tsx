import { BrowserRouter, Routes, Route, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from './store/authStore';
import { ProtectedRoute } from './components/ProtectedRoute';

// Importaciones de Edgar
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ReactivoForm } from './pages/ReactivoForm';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { EntrenamientoPage } from './pages/EntrenamientoPage';

// Componente Layout: Mantiene el diseño de Edgar alrededor de tus rutas
function DashboardLayout() {
  const { role, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarAbierta, setSidebarAbierta] = useState(true);

  const vistaActual = location.pathname;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'sans-serif' }}>
      <aside style={{
        width: sidebarAbierta ? '260px' : '80px', backgroundColor: '#7d5fff', color: 'white',
        transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', padding: '20px 10px',
        boxShadow: '4px 0 10px rgba(0,0,0,0.1)', position: 'relative', zIndex: 10
      }}>
        <button onClick={() => setSidebarAbierta(!sidebarAbierta)} style={toggleBtnStyle}>
          {sidebarAbierta ? '◀' : '▶'}
        </button>

        <div style={{ textAlign: 'center', marginBottom: '40px', fontWeight: 'bold', fontSize: '22px' }}>
          {sidebarAbierta ? 'AbilityCheck' : 'A'}
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          <button onClick={() => navigate('/')} style={sideBtnStyle(vistaActual === '/', sidebarAbierta)}>
            {sidebarAbierta ? '📝 Entrenamiento' : '📝'}
          </button>
          
          <button onClick={() => navigate('/proponer')} style={sideBtnStyle(vistaActual === '/proponer', sidebarAbierta)}>
            {sidebarAbierta ? '➕ Crowdsourcing' : '➕'}
          </button>
          
          {/* Tu validación del rol MODERADOR mapeado desde el backend */}
          {role === 'MODERADOR' && (
            <button onClick={() => navigate('/admin')} style={sideBtnStyle(vistaActual === '/admin', sidebarAbierta)}>
              {sidebarAbierta ? '🛡️ Panel Admin' : '🛡️'}
            </button>
          )}
        </nav>

        <button 
          onClick={() => { logout(); navigate('/login'); }} 
          style={{ ...sideBtnStyle(false, sidebarAbierta), backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 'auto' }}
        >
          {sidebarAbierta ? '🚪 Cerrar Sesión' : '🚪'}
        </button>
      </aside>

      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <header style={{ marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, color: '#1a1a1a', fontSize: '24px' }}>
              {vistaActual === '/' && 'Módulo de Entrenamiento'}
              {vistaActual === '/proponer' && 'Proponer Nueva Evaluación'}
              {vistaActual === '/admin' && 'Panel de Administración y Moderación'}
            </h2>
            <p style={{ color: '#666', margin: '5px 0 0 0' }}>Conectado como: <strong style={{color: '#7d5fff'}}>{role}</strong></p>
          </div>
          <div style={{ fontSize: '12px', color: '#aaa', textAlign: 'right' }}>
            UAM Cuajimalpa<br/>Ingeniería en Computación
          </div>
        </header>

        <div style={{ maxWidth: '1000px', animation: 'fadeIn 0.5s' }}>
          {/* El Outlet inyecta el componente que corresponde a la ruta */}
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}

// Componente Envoltura para las páginas de Login y Registro
function AuthWrapper() {
  const navigate = useNavigate();
  const { setTokenTest } = useAuthStore();

  return (
    <Routes>
      <Route path="/login" element={
        <LoginPage 
          alEntrar={(rol: string) => {
            // Adaptador para el botón de Edgar simulando la respuesta del backend
            const rolReal = rol === 'ADMIN' ? 'MODERADOR' : 'ALUMNO';
            setTokenTest("fake-jwt-token", rolReal as 'ALUMNO' | 'MODERADOR');
            navigate(rolReal === 'MODERADOR' ? '/admin' : '/');
          }} 
          alIrARegistro={() => navigate('/registro')} 
        />
      } />
      <Route path="/registro" element={
        <RegisterPage 
          alFinalizar={() => navigate('/login')} 
          alIrALogin={() => navigate('/login')} 
        />
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Rutas Públicas */}
      <AuthWrapper />

      {/* Rutas Protegidas */}
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<EntrenamientoPage />} />
            <Route path="/proponer" element={<ReactivoForm />} />
          </Route>
        </Route>

        {/* Ruta Exclusiva del Moderador */}
        <Route element={<ProtectedRoute requireAdmin={true} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// Estilos de Edgar
const sideBtnStyle = (activo: boolean, abierta: boolean) => ({
  width: '100%', padding: '14px', cursor: 'pointer',
  backgroundColor: activo ? 'rgba(255,255,255,0.25)' : 'transparent',
  color: 'white', border: 'none', borderRadius: '12px',
  textAlign: abierta ? 'left' as const : 'center' as const,
  fontWeight: 'bold' as const, fontSize: '15px',
  transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '12px'
});

const toggleBtnStyle: React.CSSProperties = {
  position: 'absolute', right: '-15px', top: '25px', width: '30px', height: '30px',
  borderRadius: '50%', border: 'none', backgroundColor: '#58eb9f', cursor: 'pointer',
  fontWeight: 'bold', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', display: 'flex',
  justifyContent: 'center', alignItems: 'center', color: '#1a1a1a'
};