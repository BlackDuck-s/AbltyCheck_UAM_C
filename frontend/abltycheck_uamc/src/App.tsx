import { Routes, Route } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage"; // Ajusta la ruta de importación si es necesario
import { ProfilePage } from "./pages/ProfilePage.tsx"; // Ajusta la ruta de importación

function App() {
  return (
      <Routes>
        {/* Ruta principal (Login/Registro) */}
        <Route
            path="/"
            element={
              <AuthPage
                  onLoginSuccess={(rol) => console.log('Login exitoso con rol:', rol)}
              />
            }
        />

        {/* Ruta del Dashboard de Figma */}
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
  );
}

export default App;