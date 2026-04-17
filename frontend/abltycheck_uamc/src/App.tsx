import { Routes, Route } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage"; // Ajusta la ruta de importación
import { ProfilePage } from "./pages/ProfilePage";
import { ProgressPage } from "./pages/ProgressPage";
import { PracticePage } from "./pages/PracticarPage";
import { CrowdsourcingPage } from "./pages/CrowdsourcingPage";
import { ComingSoonPage } from "./components/specific/ComingSoonPage";
import {SettingsPage} from "./pages/ConfiguracionPage.tsx";
import {AdminPanel} from "./pages/AdminDashboardPage.tsx";
import { AdminCrowdsourcingPage } from "./pages/AdminCrowdsourcingPage";
import { AdminStatsPage } from "./pages/AdminStatsPage";

function App() {
    return (
        <Routes>
            {/* Autenticación */}
            <Route path="/" element={<AuthPage onLoginSuccess={(rol) => console.log('Logueado como:', rol)} />} />

            {/* Vistas del Alumno */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/questions" element={<PracticePage />} />
            <Route path="/crowdsourcing" element={<CrowdsourcingPage />} />
            <Route path="/settings" element={<SettingsPage/>} />

            {/* Vistas del ADMIN */}
            <Route path="/admin" element={<AdminPanel/>} />
            <Route path="/admin/crowdsourcing" element={<AdminCrowdsourcingPage />} />
            <Route path="/admin/stats" element={<AdminStatsPage />} />

            {/* Vistas en Construcción */}
            <Route path="/materials" element={<ComingSoonPage />} />
        </Routes>
    );
}

export default App;