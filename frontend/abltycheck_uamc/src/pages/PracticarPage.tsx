import { useState, useEffect } from "react";
import { Sidebar } from "../components/layout/sidebar";
import { Search, Filter, Play, CheckCircle2, Clock, LayoutGrid, List } from "lucide-react";
import { motion } from "framer-motion";
import api from "../config/axiosConfig";
import { ResolverExamenPage } from "./ResolverExamenPage"; // Mantienes tu componente de examen

// Interfaz adaptada al backend actual
interface EvaluacionPractica {
  id: string;
  titulo: string;
  area: string;
  estado: string;
  dificultad?: string;
  // Estos campos son de la UI, el backend actual no los manda aún
  precisionMock?: number;
  tiempoMock?: string;
}

const colorPorArea: Record<string, string> = {
  "Bases de Datos": "#92278F",
  "POO": "#1675BB",
  "Redes": "#5C9631",
  "Algoritmos": "#F28224",
  "Estructuras": "#D8B4FE",
  "Ing. Software": "#CD1027",
  "default": "#64748B"
};

export function PracticePage() {
  const [busqueda, setBusqueda] = useState("");
  const [evaluaciones, setEvaluaciones] = useState<EvaluacionPractica[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroArea, setFiltroArea] = useState("Todas");

  // El switch para abrir el examen, igual que en tu código original
  const [examenActivoId, setExamenActivoId] = useState<string | null>(null);

  useEffect(() => {
    cargarEvaluacionesAprobadas();
  }, []);

  const cargarEvaluacionesAprobadas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/evaluaciones');
      // Filtramos solo las aprobadas y le metemos datos mock para la UI (Precisión/Tiempo)
      const soloAprobadas = response.data
          .filter((eva: EvaluacionPractica) => eva.estado === 'APROBADA')
          .map((eva: EvaluacionPractica) => ({
            ...eva,
            precisionMock: Math.floor(Math.random() * 40) + 60, // Fake 60-100%
            tiempoMock: `${Math.floor(Math.random() * 10) + 3} min` // Fake 3-12 min
          }));
      setEvaluaciones(soloAprobadas);
    } catch (error) {
      console.error("Error al cargar la biblioteca:", error);
    } finally {
      setLoading(false);
    }
  };

  const evaluacionesFiltradas = evaluaciones.filter(eva => {
    const matchBusqueda = eva.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        eva.area?.toLowerCase().includes(busqueda.toLowerCase());
    const matchFiltro = filtroArea === "Todas" || eva.area === filtroArea;
    return matchBusqueda && matchFiltro;
  });

  // Si hay un examen activo, mostramos tu componente original de resolver examen
  if (examenActivoId) {
    return (
        <div className="flex h-screen bg-[#F8F9FA] font-['Inter',sans-serif]">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-8 relative">
            <ResolverExamenPage
                evaluacionId={examenActivoId}
                alTerminar={() => setExamenActivoId(null)}
            />
          </main>
        </div>
    );
  }

  // Si no hay examen, mostramos el nuevo diseño de Explorar Preguntas
  return (
      <div className="flex h-screen bg-[#F8F9FA] font-['Inter',sans-serif]">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl text-[#1D1D1B] mb-2" style={{ fontWeight: 700 }}>
                Explorar Preguntas 📚
              </h1>
              <p className="text-[#64748B]">Encuentra y practica evaluaciones por área y dificultad</p>
            </div>

            {/* Buscador y Filtros */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar evaluaciones..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:border-[#F28224] focus:ring-2 focus:ring-[#F28224]/20 outline-none transition-all"
                />
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <select
                      className="appearance-none bg-white border border-gray-200 px-4 py-3 pr-10 rounded-2xl text-[#334155] focus:outline-none focus:border-[#F28224] cursor-pointer"
                      value={filtroArea}
                      onChange={(e) => setFiltroArea(e.target.value)}
                  >
                    <option value="Todas">Todas las áreas</option>
                    <option value="Bases de Datos">Bases de Datos</option>
                    <option value="POO">POO</option>
                    <option value="Redes">Redes</option>
                    <option value="Algoritmos">Algoritmos</option>
                  </select>
                  <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Botones de vista (Solo UI) */}
                <div className="bg-white border border-gray-200 rounded-2xl p-1 flex items-center">
                  <button className="p-2 bg-[#F1F5F9] rounded-xl text-[#334155] shadow-sm"><LayoutGrid className="w-5 h-5" /></button>
                  <button className="p-2 text-gray-400 hover:text-[#334155]"><List className="w-5 h-5" /></button>
                </div>
              </div>
            </div>

            <p className="text-sm text-[#64748B] mb-4 font-medium">{evaluacionesFiltradas.length} evaluaciones encontradas</p>

            {/* Grid de Tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                  <div className="col-span-full py-12 flex justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F28224]"></div>
                  </div>
              ) : evaluacionesFiltradas.length > 0 ? (
                  evaluacionesFiltradas.map((eva, index) => {
                    const colorHex = colorPorArea[eva.area] || colorPorArea["default"];
                    const isHard = eva.dificultad?.toLowerCase() === "difícil";

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={eva.id}
                            className="bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col h-full"
                        >
                          <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isHard ? "bg-[#CD1027]/10 text-[#CD1027]" : "bg-[#F59E0B]/10 text-[#D97706]"}`}>
                        {eva.dificultad || "Media"}
                      </span>
                            {/* Fake "Resuelto" badge based on precision */}
                            {(eva.precisionMock || 0) > 80 && (
                                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#5C9631]/10 text-[#5C9631]">
                          <CheckCircle2 className="w-3 h-3" /> Resuelto
                        </span>
                            )}
                          </div>

                          <h3 className="text-xl text-[#1D1D1B] font-bold mb-3 line-clamp-2 min-h-[56px] leading-tight">
                            {eva.titulo}
                          </h3>

                          <div className="flex items-center gap-3 mb-6">
                      <span
                          className="px-2.5 py-1 rounded-full text-xs font-medium border"
                          style={{ color: colorHex, backgroundColor: `${colorHex}10`, borderColor: `${colorHex}30` }}
                      >
                        {eva.area}
                      </span>
                            <span className="flex items-center gap-1 text-xs text-[#64748B] font-medium">
                        <Clock className="w-3.5 h-3.5" /> {eva.tiempoMock}
                      </span>
                          </div>

                          <div className="mt-auto">
                            <div className="flex justify-between items-center text-xs text-[#64748B] mb-2 font-medium">
                              <span>Precisión Histórica</span>
                              <span>{eva.precisionMock}%</span>
                            </div>
                            <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden mb-6">
                              <div
                                  className="h-full rounded-full bg-gradient-to-r from-[#F28224] to-[#D97120]"
                                  style={{ width: `${eva.precisionMock}%` }}
                              />
                            </div>

                            <button
                                onClick={() => setExamenActivoId(eva.id)}
                                className="flex items-center gap-2 text-[#F28224] font-semibold hover:text-[#D97120] transition-colors group"
                            >
                              Practicar <Play className="w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </motion.div>
                    )
                  })
              ) : (
                  <div className="col-span-full py-12 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200">
                    <Search className="w-10 h-10 text-gray-300 mb-3" />
                    <p className="text-[#64748B] font-medium">No encontramos evaluaciones que coincidan con tu búsqueda.</p>
                  </div>
              )}
            </div>

          </div>
        </main>
      </div>
  );
}