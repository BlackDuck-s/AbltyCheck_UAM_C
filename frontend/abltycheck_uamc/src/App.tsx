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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
      {}
      <aside style={sidebarStyle}>
        <h2 style={{ textAlign: 'center', color: 'white' }}>AbltyCheck</h2>
        <nav style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setVista('PANEL')} style={navBtnStyle(vista === 'PANEL')}>🏠 Mi Panel</button>
          <button onClick={() => setVista('PRACTICAR')} style={navBtnStyle(vista === 'PRACTICAR')}>📖 Practicar</button>
          <button onClick={() => setVista('CROWD')} style={navBtnStyle(vista === 'CROWD')}>➕ Colaborar</button>
          
          {}
          {rol === 'ADMIN' && (
            <button onClick={() => setVista('ADMIN')} style={navBtnStyle(vista === 'ADMIN')}>🛡️ Panel Admin</button>
          )}
        </nav>

        <button onClick={() => setRol(null)} style={logoutBtnStyle}>Cerrar Sesión</button>
      </aside>

      {}
      <main style={{ flex: 1, padding: '40px' }}>
        {vista === 'PANEL' && <EntrenamientoPage />}
        {vista === 'PRACTICAR' && <PracticarPage />}
        {vista === 'CROWD' && <ReactivoForm />}
        {vista === 'ADMIN' && rol === 'ADMIN' && <AdminDashboardPage />}
      </main>
    </div>
  );
}

const sidebarStyle: React.CSSProperties = { width: '260px', backgroundColor: '#7d5fff', padding: '20px', display: 'flex', flexDirection: 'column' };
const navBtnStyle = (activo: boolean) => ({ backgroundColor: activo ? 'rgba(255,255,255,0.2)' : 'transparent', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', textAlign: 'left' as const, cursor: 'pointer', fontWeight: 'bold' as const });
const logoutBtnStyle: React.CSSProperties = { marginTop: 'auto', backgroundColor: 'rgba(0,0,0,0.1)', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer' };

export default App;