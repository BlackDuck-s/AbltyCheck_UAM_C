import { useState, useEffect } from "react";
import { Sidebar } from "../components/layout/sidebar";
import { Search, Users, FileText, Clock, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";
import api from "../config/axiosConfig";

// Interfaces para tipar la respuesta de tu backend (Spring Boot / Firebase)
interface EstudianteAdminView {
  id: string; // O el ID de Firestore
  nombre: string;
  matricula: string;
  email: string;
  preguntasResueltas: number;
  precision: number;
}

interface AdminStats {
  usuariosActivos: number;
  reactivosTotales: number;
  precisionGlobal: number;
  propuestasPendientes: number;
}

export function AdminPanel() {
  const [studentSearch, setStudentSearch] = useState("");
  const [estudiantes, setEstudiantes] = useState<EstudianteAdminView[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    usuariosActivos: 0,
    reactivosTotales: 0,
    precisionGlobal: 0,
    propuestasPendientes: 0
  });
  const [loading, setLoading] = useState(true);

  // Carga de datos reales desde el backend
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Ejecutamos ambas peticiones al mismo tiempo para mayor velocidad
        const [estudiantesRes, statsRes] = await Promise.all([
          api.get('/admin/estudiantes'),
          api.get('/admin/estadisticas')
        ]);

        setEstudiantes(estudiantesRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Error cargando el panel de administrador:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const filteredStudents = estudiantes.filter(
      (s) =>
          (s.nombre || "").toLowerCase().includes(studentSearch.toLowerCase()) ||
          (s.matricula || "").toLowerCase().includes(studentSearch.toLowerCase())
  );

  if (loading) {
    return (
        <div className="flex h-screen bg-[#F8F9FA] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28224]"></div>
        </div>
    );
  }

  return (
      <div className="flex h-screen bg-[#F8F9FA] font-['Inter',sans-serif]">
        <Sidebar isAdmin />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl text-[#1D1D1B] mb-2" style={{ fontWeight: 700 }}>
                Centro de Comando 🛡️
              </h1>
              <p className="text-[#64748B]">
                Supervisa el rendimiento global de los estudiantes de la plataforma.
              </p>
            </div>

            {/* 1. SECCIÓN DE MÉTRICAS (Datos Reales) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-14 h-14 bg-[#F28224]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-7 h-7 text-[#F28224]" />
                </div>
                <div>
                  <p className="text-sm text-[#64748B] font-medium mb-1">Usuarios Activos</p>
                  <h3 className="text-2xl font-bold text-[#1D1D1B]">{stats.usuariosActivos}</h3>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-14 h-14 bg-[#3B82F6]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-7 h-7 text-[#3B82F6]" />
                </div>
                <div>
                  <p className="text-sm text-[#64748B] font-medium mb-1">Reactivos Totales</p>
                  <h3 className="text-2xl font-bold text-[#1D1D1B]">{stats.reactivosTotales}</h3>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-14 h-14 bg-[#10B981]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-7 h-7 text-[#10B981]" />
                </div>
                <div>
                  <p className="text-sm text-[#64748B] font-medium mb-1">Precisión Global</p>
                  <h3 className="text-2xl font-bold text-[#1D1D1B]">{stats.precisionGlobal.toFixed(1)}%</h3>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#1D1D1B] p-6 rounded-3xl shadow-lg shadow-black/5 flex items-center gap-4">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-7 h-7 text-[#F28224]" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium mb-1">Por Revisar</p>
                  <h3 className="text-2xl font-bold text-white">{stats.propuestasPendientes} <span className="text-sm font-normal text-gray-400">propuestas</span></h3>
                </div>
              </motion.div>
            </div>

            {/* 2. TABLA DE ESTUDIANTES */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-[#F28224]" />
                  <h2 className="text-xl text-[#1D1D1B]" style={{ fontWeight: 700 }}>Rendimiento Estudiantil</h2>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                      type="text"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Buscar por nombre o matrícula..."
                      className="pl-10 pr-4 py-2 bg-[#F8F9FA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F28224]/30 border border-transparent focus:border-[#F28224] transition-all w-full sm:w-72 text-[#1D1D1B]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-[#F8F9FA]">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">Estudiante</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">Matrícula</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">Correo Electrónico</th>
                    <th className="text-center px-6 py-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">Prácticas Resueltas</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">Efectividad Global</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                  {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#F28224]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                  {/* CORRECCIÓN: Fallback para el avatar */}
                                  <span className="text-[#F28224] font-bold">{(student.nombre || "U").charAt(0).toUpperCase()}</span>
                                </div>
                                {/* CORRECCIÓN: Fallback para el nombre completo */}
                                <span className="text-[#1D1D1B] font-medium whitespace-nowrap">{student.nombre || "Usuario Anónimo"}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                          <span className="text-sm text-[#64748B] font-mono bg-white border border-gray-200 px-2.5 py-1 rounded-lg">
                            {student.matricula || "Sin matrícula"}
                          </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#64748B]">
                              {student.email || "---"}
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-[#1D1D1B]">
                              {student.preguntasResueltas || 0}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-full max-w-[120px] h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                      className={`h-full rounded-full transition-all duration-500 ${(student.precision || 0) >= 80 ? 'bg-[#10B981]' : (student.precision || 0) >= 60 ? 'bg-[#F28224]' : 'bg-[#EF4444]'}`}
                                      style={{ width: `${student.precision || 0}%` }}
                                  />
                                </div>
                                {/* CORRECCIÓN: Fallback para el toFixed */}
                                <span className="text-sm font-bold text-[#64748B] w-10">{(student.precision || 0).toFixed(0)}%</span>
                              </div>
                            </td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-[#64748B]">
                          No se encontraron estudiantes.
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </motion.div>

          </div>
        </main>
      </div>
  );
}