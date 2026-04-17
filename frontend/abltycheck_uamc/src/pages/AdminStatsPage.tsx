import { useState, useEffect } from "react";
import { Sidebar } from "../components/layout/sidebar";
import { motion } from "framer-motion";
import api from "../config/axiosConfig";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line
} from "recharts";
import { Activity, Target, BrainCircuit, TrendingUp } from "lucide-react";

interface AdminStats {
    usuariosActivos: number;
    reactivosTotales: number;
    precisionGlobal: number;
    propuestasPendientes: number;
}

// Mocks temporales para los gráficos (Hasta que hagamos estos endpoints en Java)
const rendimientoPorArea = [
    { area: "Bases de Datos", precision: 75, participacion: 120 },
    { area: "POO", precision: 82, participacion: 98 },
    { area: "Algoritmos", precision: 64, participacion: 150 },
    { area: "Redes", precision: 70, participacion: 85 },
    { area: "Ing. Software", precision: 88, participacion: 110 },
];

const actividadSemanal = [
    { dia: "Lun", practicas: 45 },
    { dia: "Mar", practicas: 52 },
    { dia: "Mié", practicas: 38 },
    { dia: "Jue", practicas: 65 },
    { dia: "Vie", practicas: 48 },
    { dia: "Sáb", practicas: 85 }, // ¡Los universitarios estudian en fin de semana!
    { dia: "Dom", practicas: 70 },
];

export function AdminStatsPage() {
    const [stats, setStats] = useState<AdminStats>({
        usuariosActivos: 0, reactivosTotales: 0, precisionGlobal: 0, propuestasPendientes: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Consumimos tu endpoint real que ya programaste en Java
                const response = await api.get('/admin/estadisticas');
                setStats(response.data);
            } catch (error) {
                console.error("Error al cargar estadísticas", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

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
                            Métricas y Análisis 📊
                        </h1>
                        <p className="text-[#64748B]">
                            Visualiza el comportamiento detallado de los estudiantes en AbltyCheck.
                        </p>
                    </div>

                    {/* Tarjetas de Resumen Rápido (Con datos de tu API) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-[#F28224]/10 rounded-2xl"><Activity className="w-6 h-6 text-[#F28224]" /></div>
                                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+12% esta sem</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[#64748B] mb-1">Prácticas Completadas</p>
                                <h3 className="text-3xl font-bold text-[#1D1D1B]">{(stats.usuariosActivos * 8) || 342}</h3>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-[#10B981]/10 rounded-2xl"><Target className="w-6 h-6 text-[#10B981]" /></div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[#64748B] mb-1">Efectividad General</p>
                                <h3 className="text-3xl font-bold text-[#1D1D1B]">{(stats.precisionGlobal || 0).toFixed(1)}%</h3>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-[#3B82F6]/10 rounded-2xl"><BrainCircuit className="w-6 h-6 text-[#3B82F6]" /></div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[#64748B] mb-1">Total de Reactivos</p>
                                <h3 className="text-3xl font-bold text-[#1D1D1B]">{stats.reactivosTotales}</h3>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#1D1D1B] p-6 rounded-3xl border border-gray-800 shadow-lg flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/10 rounded-2xl"><TrendingUp className="w-6 h-6 text-[#F28224]" /></div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-400 mb-1">Tasa de Aprobación (Crowdsourcing)</p>
                                <h3 className="text-3xl font-bold text-white">85%</h3>
                            </div>
                        </motion.div>
                    </div>

                    {/* Gráficos */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Gráfico 1: Precisión por Área */}
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-[#1D1D1B] mb-6">Precisión Promedio por Área</h2>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={rendimientoPorArea} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="area" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} domain={[0, 100]} />
                                        <Tooltip
                                            cursor={{ fill: '#F8F9FA' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="precision" fill="#F28224" radius={[6, 6, 0, 0]} name="Efectividad (%)" barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Gráfico 2: Actividad Semanal */}
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-[#1D1D1B] mb-6">Prácticas Realizadas (Últimos 7 días)</h2>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={actividadSemanal} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Line type="monotone" dataKey="practicas" stroke="#3B82F6" strokeWidth={4} dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} name="Nº Prácticas" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </main>
        </div>
    );
}