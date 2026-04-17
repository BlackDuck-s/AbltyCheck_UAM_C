import { useState, useEffect } from "react";
import { Sidebar } from "../components/layout/sidebar.tsx";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Building2, BookOpen, GraduationCap, Trophy, MessageSquarePlus } from "lucide-react";
import { motion } from "framer-motion";
import api from "../config/axiosConfig";

// Interfaces para TypeScript
interface UsuarioPerfil {
    matricula: string;
    nombre: string | null; // Aceptamos que puede venir nulo de la DB vieja
    email: string;
    rol: string;
    biografia: string | null;
    carrera: string | null;
    division: string | null;
    unidad: string | null;
    radarSkills: Record<string, number>;
    fotoUrl?: string | null;
}

interface RankingUser {
    matricula: string;
    nombre: string | null; // Aceptamos que puede venir nulo
    total: number;
    metricaExtra: string;
}

interface RadarDataPoint {
    area: string;
    score: number;
    fullMark: number;
}

const rankColors = ["#F28224", "#94A3B8", "#CD7F32"];

export function ProfilePage() {
    const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null);
    const [radarData, setRadarData] = useState<RadarDataPoint[]>([]);
    const [topSolvers, setTopSolvers] = useState<RankingUser[]>([]);
    const [topContributors, setTopContributors] = useState<RankingUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [perfilRes, resueltasRes, aportesRes] = await Promise.all([
                    api.get("/usuarios/perfil"),
                    api.get("/estadisticas/ranking/resueltas?limit=6"),
                    api.get("/estadisticas/ranking/aportaciones?limit=6")
                ]);

                const datosPerfil = perfilRes.data;
                setPerfil(datosPerfil);

                if (datosPerfil.radarSkills) {
                    const formattedRadar = Object.keys(datosPerfil.radarSkills).map((key) => ({
                        area: key,
                        score: datosPerfil.radarSkills[key],
                        fullMark: 100,
                    }));
                    setRadarData(formattedRadar);
                }

                setTopSolvers(resueltasRes.data);
                setTopContributors(aportesRes.data);
            } catch (error) {
                console.error("Error al cargar los datos del perfil:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen bg-[#F8F9FA] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28224]"></div>
            </div>
        );
    }

    if (!perfil) return <div className="p-8 text-center text-gray-500">Error cargando perfil...</div>;

    // Manejo de valores por defecto si vienen nulos
    const nombreSeguro = perfil.nombre || "Usuario UAM";
    const inicialSegura = nombreSeguro.charAt(0).toUpperCase();

    const badges = [
        { label: `Unidad: ${perfil.unidad || 'UAM Cuajimalpa'}`, icon: Building2, color: "#F28224", bg: "#FFF7ED" },
        { label: `División: ${perfil.division || 'DCNI'}`, icon: BookOpen, color: "#1675BB", bg: "#EFF6FF" },
        { label: `Carrera: ${perfil.carrera || 'Ing. en Computación'}`, icon: GraduationCap, color: "#5C9631", bg: "#F0FDF4" },
    ];

    return (
        <div className="flex h-screen bg-[#F8F9FA] font-['Inter',sans-serif]">
            <Sidebar />

            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto">
                    {/* ═══ Profile Card ═══ */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm p-8 mb-6">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Left: Avatar + Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-6 mb-5">
                                    <div className="w-24 h-24 bg-gradient-to-br from-[#F28224] to-[#D97120] rounded-full flex items-center justify-center shadow-lg shadow-[#F28224]/20 flex-shrink-0 overflow-hidden border-4 border-white">
                                        {perfil.fotoUrl ? (
                                            <img src={perfil.fotoUrl} alt="Perfil" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-white text-4xl font-bold">{inicialSegura}</span>
                                        )}
                                    </div>
                                    <div>
                                        <h1 className="text-2xl text-[#1D1D1B]" style={{ fontWeight: 700 }}>
                                            {nombreSeguro}
                                        </h1>
                                        <p className="text-[#64748B] font-mono">{perfil.matricula}</p>
                                    </div>
                                </div>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-2 mb-5">
                                    {badges.map((badge) => (
                                        <div key={badge.label} className="flex items-center gap-2 px-3 py-2 rounded-2xl border" style={{ backgroundColor: badge.bg, borderColor: `${badge.color}20` }}>
                                            <badge.icon className="w-4 h-4" style={{ color: badge.color }} />
                                            <span className="text-xs text-[#1D1D1B]" style={{ fontWeight: 500 }}>{badge.label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* About Me */}
                                <div className="bg-[#F8F9FA] rounded-2xl p-4">
                                    <p className="text-sm text-[#1D1D1B] mb-1" style={{ fontWeight: 500 }}>Acerca de mí</p>
                                    <p className="text-[#64748B] text-sm leading-relaxed">
                                        {perfil.biografia || "Estudiante apasionado por el desarrollo y la práctica constante. 🚀"}
                                    </p>
                                </div>
                            </div>

                            {/* Right: Mini Radar */}
                            <div className="w-full lg:w-[280px] flex-shrink-0">
                                <p className="text-sm text-[#1D1D1B] mb-2" style={{ fontWeight: 600 }}>Resumen de Habilidades</p>
                                <div className="bg-[#F8F9FA] rounded-2xl p-2">
                                    {radarData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={200}>
                                            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                                                <PolarGrid stroke="#E2E8F0" />
                                                <PolarAngleAxis dataKey="area" tick={{ fill: "#64748B", fontSize: 10 }} />
                                                <Radar dataKey="score" stroke="#F28224" fill="#F28224" fillOpacity={0.2} strokeWidth={2} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-[200px] flex items-center justify-center text-sm text-[#64748B] text-center px-4">
                                            Aún no hay suficientes prácticas registradas
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ═══ Global Leaderboard ═══ */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <h2 className="text-2xl text-[#1D1D1B] mb-1" style={{ fontWeight: 700 }}>Top Global de Usuarios 🏆</h2>
                        <p className="text-[#64748B] mb-6">Los estudiantes más activos de la plataforma</p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Más Preguntas Resueltas */}
                            <div className="bg-white rounded-3xl shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 bg-[#F28224]/10 rounded-2xl flex items-center justify-center">
                                        <Trophy className="w-5 h-5 text-[#F28224]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[#1D1D1B]" style={{ fontWeight: 600 }}>Más Preguntas Resueltas</h3>
                                        <p className="text-xs text-[#64748B]">Ranking por práctica</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {topSolvers.map((user, i) => {
                                        const nombreRanking = user.nombre || "Estudiante";
                                        const isMe = user.matricula === perfil.matricula;
                                        return (
                                            <div key={user.matricula} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F8F9FA] transition-colors cursor-pointer group">
                        <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{ fontWeight: 700, backgroundColor: i < 3 ? `${rankColors[i]}15` : "#F1F5F9", color: i < 3 ? rankColors[i] : "#64748B" }}>
                          {i + 1}
                        </span>
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isMe ? "bg-gradient-to-br from-[#F28224] to-[#D97120]" : "bg-gradient-to-br from-[#93C5FD] to-[#1675BB]"}`}>
                                                    <span className="text-white text-xs" style={{ fontWeight: 600 }}>{nombreRanking.charAt(0).toUpperCase()}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm truncate ${isMe ? "text-[#F28224]" : "text-[#1D1D1B]"}`} style={{ fontWeight: 500 }}>
                                                        {nombreRanking} {isMe && " (Tú)"}
                                                    </p>
                                                    <p className="text-[10px] text-[#64748B]">{user.metricaExtra}</p>
                                                </div>
                                                <span className="text-sm text-[#1D1D1B]" style={{ fontWeight: 700 }}>{user.total}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Más Preguntas Enviadas (Crowdsourcing) */}
                            <div className="bg-white rounded-3xl shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 bg-[#92278F]/10 rounded-2xl flex items-center justify-center">
                                        <MessageSquarePlus className="w-5 h-5 text-[#92278F]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[#1D1D1B]" style={{ fontWeight: 600 }}>Más Preguntas Enviadas</h3>
                                        <p className="text-xs text-[#64748B]">Ranking crowdsourcing</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {topContributors.map((user, i) => {
                                        const nombreRanking = user.nombre || "Estudiante";
                                        const isMe = user.matricula === perfil.matricula;
                                        return (
                                            <div key={user.matricula} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F8F9FA] transition-colors cursor-pointer group">
                        <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{ fontWeight: 700, backgroundColor: i < 3 ? `${rankColors[Math.min(i, 2)]}15` : "#F1F5F9", color: i < 3 ? rankColors[Math.min(i, 2)] : "#64748B" }}>
                          {i + 1}
                        </span>
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isMe ? "bg-gradient-to-br from-[#F28224] to-[#D97120]" : "bg-gradient-to-br from-[#D8B4FE] to-[#92278F]"}`}>
                                                    <span className="text-white text-xs" style={{ fontWeight: 600 }}>{nombreRanking.charAt(0).toUpperCase()}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm truncate ${isMe ? "text-[#F28224]" : "text-[#1D1D1B]"}`} style={{ fontWeight: 500 }}>
                                                        {nombreRanking} {isMe && " (Tú)"}
                                                    </p>
                                                </div>
                                                <span className="text-sm text-[#1D1D1B]" style={{ fontWeight: 700 }}>{user.total}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}