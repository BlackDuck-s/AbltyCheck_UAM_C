import { useState, useEffect, useMemo } from "react";
import { Sidebar } from "../components/layout/sidebar.tsx";
import {
    Radar as RadarShape,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { CheckCircle2, XCircle, Clock, Flame, Zap } from "lucide-react";
import { motion } from "framer-motion";
import api from "../config/axiosConfig";
import { AxiosError } from "axios";

// --- Interfaces de TypeScript ---
interface RadarDataPoint {
    area: string;
    score: number;
    fullMark: number;
}

interface ResultadoHistorico {
    id: string;
    titulo: string;
    area: string;
    calificacion: number;
    aciertos: number;
    totalPreguntas: number;
    fecha: string;
    dificultad: string;
}

interface HabitosDTO {
    mapaActividad: Record<string, number>;
    rachaActual: number;
    rachaMasLarga: number;
    totalPreguntasResueltas: number;
}

// --- Configuración de Colores ---
const heatmapColors: Record<number, string> = {
    [-1]: "transparent",
    0: "#F1F5F9",
    1: "#FFEDD5",
    2: "#FDBA74",
    3: "#F28224",
    4: "#D97120",
};

const baseMedals = [
    { name: "Madera", emoji: "🪵", threshold: 10 },
    { name: "Bronce", emoji: "🥉", threshold: 25 },
    { name: "Plata", emoji: "🥈", threshold: 50 },
    { name: "Oro", emoji: "🥇", threshold: 100 },
    { name: "Platino", emoji: "💎", threshold: 200 },
    { name: "Diamante", emoji: "👑", threshold: 500 },
];

export function ProgressPage() {
    const [radarData, setRadarData] = useState<RadarDataPoint[]>([]);
    const [recentHistory, setRecentHistory] = useState<ResultadoHistorico[]>([]);
    const [habits, setHabits] = useState<HabitosDTO>({
        mapaActividad: {}, rachaActual: 0, rachaMasLarga: 0, totalPreguntasResueltas: 0
    });
    const [loading, setLoading] = useState(true);

    // --- Fetching de Datos ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [perfilRes, historialRes, habitosRes] = await Promise.all([
                    api.get("/usuarios/perfil"),
                    api.get("/historial/mis-resultados"),
                    api.get("/estadisticas/mis-habitos")
                ]);

                // 1. Radar Data (Viene del perfil)
                if (perfilRes.data.radarSkills) {
                    const formattedRadar = Object.keys(perfilRes.data.radarSkills).map((key) => ({
                        area: key,
                        score: Math.round(perfilRes.data.radarSkills[key]),
                        fullMark: 100,
                    }));
                    setRadarData(formattedRadar);
                }

                // 2. Historial Reciente (Tomamos los últimos 10)
                const historialCompleto: ResultadoHistorico[] = historialRes.data;
                setRecentHistory(historialCompleto.slice(-10).reverse());

                // 3. Hábitos y Rachas
                setHabits(habitosRes.data);

            } catch (err) {
                const axiosError = err as AxiosError;
                console.error("Error al cargar progreso:", axiosError.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // --- Lógica del Heatmap con datos reales ---
    const heatmapData = useMemo(() => {
        const weeks: number[][] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalizar a medianoche

        for (let w = 15; w >= 0; w--) {
            const week: number[] = [];
            for (let d = 0; d < 7; d++) {
                const date = new Date(today);
                date.setDate(date.getDate() - (w * 7 + (6 - d)));
                const isFuture = date > today;

                if (isFuture) {
                    week.push(-1);
                } else {
                    // Extraemos la fecha en formato YYYY-MM-DD para buscarla en el mapa del backend
                    const dateString = date.toISOString().split('T')[0];
                    const count = habits.mapaActividad ? (habits.mapaActividad[dateString] || 0) : 0;

                    // Asignar el nivel de color según la cantidad de prácticas ese día
                    if (count === 0) week.push(0);
                    else if (count <= 2) week.push(1);
                    else if (count <= 4) week.push(2);
                    else if (count <= 6) week.push(3);
                    else week.push(4);
                }
            }
            weeks.push(week);
        }
        return weeks;
    }, [habits.mapaActividad]);

    // --- Lógica de Medallas Dinámicas ---
    const medals = useMemo(() => {
        return baseMedals.map(medal => ({
            ...medal,
            current: habits.totalPreguntasResueltas,
            unlocked: habits.totalPreguntasResueltas >= medal.threshold
        }));
    }, [habits.totalPreguntasResueltas]);


    if (loading) {
        return (
            <div className="flex h-screen bg-[#F8F9FA] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28224]"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#F8F9FA] font-['Inter',sans-serif]">
            <Sidebar />

            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl text-[#1D1D1B]" style={{ fontWeight: 700 }}>
                            Mi Progreso 📊
                        </h1>
                        <p className="text-[#64748B] mt-1">
                            Tu rendimiento y hábitos de práctica
                        </p>
                    </div>

                    {/* ═══ 2×2 Grid ═══ */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* ╔═══ TOP-LEFT: Radar Chart ═══╗ */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 shadow-sm">
                            <h2 className="text-lg text-[#1D1D1B] mb-1" style={{ fontWeight: 600 }}>Habilidades por Área</h2>
                            <p className="text-sm text-[#64748B] mb-3">Tu dominio promedio histórico</p>
                            <div className="bg-[#F8F9FA] rounded-2xl p-2">
                                {radarData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={340}>
                                        <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                                            <PolarGrid stroke="#E2E8F0" />
                                            <PolarAngleAxis dataKey="area" tick={{ fill: "#64748B", fontSize: 11 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 10 }} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "white",
                                                    border: "none",
                                                    borderRadius: "16px",
                                                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                                    padding: "12px 16px",
                                                }}
                                                formatter={(value: number | string | readonly (number | string)[] | undefined) => {
                                                    // Si Recharts se pone creativo y manda un arreglo, tomamos el primer valor
                                                    const val = Array.isArray(value) ? value[0] : value;
                                                    return [`${val || 0}%`, "Dominio"];
                                                }}
                                            />
                                            <RadarShape name="Habilidades" dataKey="score" stroke="#F28224" fill="#F28224" fillOpacity={0.15} strokeWidth={2.5} />
                                            <RadarShape name="Habilidades" dataKey="fullMark" stroke="#1675BB" fill="#1675BB" fillOpacity={0.04} strokeWidth={1} strokeDasharray="4 4" />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[340px] flex items-center justify-center text-sm text-[#64748B]">
                                        Completa algunas prácticas para generar tu radar.
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* ╔═══ TOP-RIGHT: Habits & Activity ═══╗ */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white rounded-3xl p-6 shadow-sm flex flex-col">
                            <h2 className="text-lg text-[#1D1D1B] mb-1" style={{ fontWeight: 600 }}>Hábitos y Actividad</h2>
                            <p className="text-sm text-[#64748B] mb-4">Últimas 16 semanas</p>

                            {/* Heatmap */}
                            <div className="mb-4">
                                <div className="flex items-center justify-end gap-2 text-xs text-[#64748B] mb-2">
                                    <span>Menos</span>
                                    {[0, 1, 2, 3, 4].map((level) => (
                                        <div key={level} className="w-3 h-3 rounded-sm" style={{ backgroundColor: heatmapColors[level] }} />
                                    ))}
                                    <span>Más</span>
                                </div>
                                <div className="flex gap-[3px] overflow-x-auto pb-1">
                                    {heatmapData.map((week, wi) => (
                                        <div key={wi} className="flex flex-col gap-[3px]">
                                            {week.map((day, di) => (
                                                <div key={`${wi}-${di}`} className="w-3 h-3 rounded-sm" style={{ backgroundColor: day === -1 ? "transparent" : heatmapColors[day] || "#F1F5F9" }} />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 my-4" />

                            {/* Streaks */}
                            <div className="grid grid-cols-2 gap-4 flex-1">
                                <div className="bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                                    <div className="w-14 h-14 bg-gradient-to-br from-[#F28224] to-[#D97120] rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-[#F28224]/20">
                                        <Flame className="w-7 h-7 text-white" />
                                    </div>
                                    <p className="text-xs text-[#64748B] mb-1">Racha Actual</p>
                                    <p className="text-3xl text-[#1D1D1B]" style={{ fontWeight: 700 }}>{habits.rachaActual}</p>
                                    <p className="text-xs text-[#64748B]">días</p>
                                </div>
                                <div className="bg-gradient-to-br from-[#FEFCE8] to-[#FEF9C3] rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                                    <div className="w-14 h-14 bg-gradient-to-br from-[#FDE047] to-[#F59E0B] rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-[#F59E0B]/20">
                                        <Zap className="w-7 h-7 text-white" />
                                    </div>
                                    <p className="text-xs text-[#64748B] mb-1">Racha Más Larga</p>
                                    <p className="text-3xl text-[#1D1D1B]" style={{ fontWeight: 700 }}>{habits.rachaMasLarga}</p>
                                    <p className="text-xs text-[#64748B]">días</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* ╔═══ BOTTOM-LEFT: Recent History ═══╗ */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-6 shadow-sm">
                            <h2 className="text-lg text-[#1D1D1B] mb-1" style={{ fontWeight: 600 }}>Historial Reciente</h2>
                            <p className="text-sm text-[#64748B] mb-4">Detalle de preguntas practicadas</p>

                            {recentHistory.length > 0 ? (
                                <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <thead className="sticky top-0 bg-white z-10">
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left py-3 pr-3 text-[#64748B]" style={{ fontWeight: 500 }}>Evaluación</th>
                                            <th className="text-center py-3 px-2 text-[#64748B]" style={{ fontWeight: 500 }}>Área</th>
                                            <th className="text-center py-3 px-2 text-[#64748B]" style={{ fontWeight: 500 }}>Resultado</th>
                                            <th className="text-center py-3 px-2 text-[#64748B]" style={{ fontWeight: 500 }}>Calificación</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {recentHistory.map((q) => {
                                            const isGood = q.calificacion >= 70;
                                            return (
                                                <tr key={q.id} className="border-b border-gray-50 hover:bg-[#F8F9FA] transition-colors">
                                                    <td className="py-3 pr-3">
                                                        <p className="text-[#1D1D1B] truncate max-w-[180px]" style={{ fontWeight: 500 }}>{q.titulo || `Práctica de ${q.area}`}</p>
                                                    </td>
                                                    <td className="py-3 px-2 text-center">
                              <span className="px-2 py-1 rounded-full text-[10px] bg-[#92278F]/10 text-[#92278F] whitespace-nowrap" style={{ fontWeight: 500 }}>
                                {q.area}
                              </span>
                                                    </td>
                                                    <td className="py-3 px-2 text-center">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${isGood ? "bg-[#5C9631]/10 text-[#5C9631]" : "bg-[#CD1027]/10 text-[#CD1027]"}`} style={{ fontWeight: 600 }}>
                                {isGood ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                  {q.aciertos}/{q.totalPreguntas}
                              </span>
                                                    </td>
                                                    <td className="py-3 px-2 text-center">
                                                        <span className="text-[#64748B] font-mono">{q.calificacion.toFixed(1)}%</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-[#64748B]">
                                    <Clock className="w-8 h-8 mb-2 opacity-50" />
                                    <p className="text-sm">Aún no hay historial registrado.</p>
                                </div>
                            )}
                        </motion.div>

                        {/* ╔═══ BOTTOM-RIGHT: Achievements & Medals ═══╗ */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-3xl p-6 shadow-sm">
                            <div className="flex justify-between items-end mb-5">
                                <div>
                                    <h2 className="text-lg text-[#1D1D1B] mb-1" style={{ fontWeight: 600 }}>Medallas y Logros</h2>
                                    <p className="text-sm text-[#64748B]">Desbloquea medallas al practicar</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl text-[#F28224]" style={{ fontWeight: 700 }}>{habits.totalPreguntasResueltas}</p>
                                    <p className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">Resueltas</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {medals.map((medal) => {
                                    const progress = Math.min(100, (medal.current / medal.threshold) * 100);
                                    return (
                                        <div key={medal.name} className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${medal.unlocked ? "bg-white border-[#F28224]/20 shadow-sm" : "bg-[#F8F9FA] border-gray-200/50 opacity-60"}`}>
                                            <span className={`text-4xl mb-2 ${medal.unlocked ? "" : "grayscale"}`}>{medal.emoji}</span>
                                            <span className="text-sm text-[#1D1D1B] text-center" style={{ fontWeight: 600 }}>{medal.name}</span>
                                            <span className="text-[10px] text-[#64748B] mt-0.5 mb-2">{medal.threshold} preg.</span>
                                            <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                                                <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: medal.unlocked ? "#F28224" : "#94A3B8" }} />
                                            </div>
                                            {medal.unlocked && (
                                                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#F28224] rounded-full flex items-center justify-center shadow-sm">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>

                    </div>
                </div>
            </main>
        </div>
    );
}