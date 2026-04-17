import { useState, useEffect } from 'react';
import { Sidebar } from '../components/layout/sidebar';
import { CheckCircle2, XCircle, Search, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../config/axiosConfig';

// Interfaces basadas en la estructura que manda el alumno
interface Opcion { texto: string; esCorrecta: boolean; }
interface Pregunta { enunciado: string; opciones: Opcion[]; }
interface Propuesta {
    id: string;
    titulo: string;
    area: string;
    dificultad: string;
    autorId: string;
    fecha?: string;
    preguntas: Pregunta[];
}

export function AdminCrowdsourcingPage() {
    const [propuestas, setPropuestas] = useState<Propuesta[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // 1. Cargar las propuestas pendientes reales desde Spring Boot
    useEffect(() => {
        const fetchPendientes = async () => {
            try {
                const response = await api.get('/admin/reactivos/pendientes');
                setPropuestas(response.data);
            } catch (error) {
                console.error("Error al cargar pendientes", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPendientes();
    }, []);

    // 2. Acción para Aprobar o Rechazar conectada al Backend
    const handleAction = async (id: string, nuevoEstado: 'APROBADO' | 'RECHAZADO') => {
        try {
            // Llamada real al backend
            await api.put(`/admin/reactivos/${id}/estado`, { estado: nuevoEstado });

            // Actualizamos la UI quitando la propuesta de la lista instantáneamente
            setPropuestas(propuestas.filter(p => p.id !== id));
            if (expandedId === id) setExpandedId(null);

        } catch (error) {
            console.error(`Error al marcar como ${nuevoEstado}`, error);
            alert("Hubo un error al procesar la propuesta. Verifica tu conexión.");
        }
    };

    const filteredPropuestas = propuestas.filter(p =>
        p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.autorId.includes(searchTerm)
    );

    if (loading) return <div className="flex h-screen bg-[#F8F9FA] items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28224]"></div></div>;

    return (
        <div className="flex h-screen bg-[#F8F9FA] font-['Inter',sans-serif]">
            <Sidebar isAdmin />

            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl text-[#1D1D1B] mb-2" style={{ fontWeight: 700 }}>Aprobar Reactivos 📋</h1>
                            <p className="text-[#64748B]">Revisa el contenido enviado por la comunidad de estudiantes.</p>
                        </div>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por título, área o autor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#F28224] focus:ring-2 focus:ring-[#F28224]/20 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Lista de Propuestas */}
                    <div className="space-y-4">
                        <AnimatePresence>
                            {filteredPropuestas.length === 0 ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm">
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#1D1D1B] mb-2">¡Todo al día!</h3>
                                    <p className="text-[#64748B]">No hay propuestas pendientes de revisión en este momento.</p>
                                </motion.div>
                            ) : (
                                filteredPropuestas.map((propuesta) => (
                                    <motion.div
                                        key={propuesta.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                                    >
                                        {/* Cabecera de la Tarjeta (Clickeable para expandir) */}
                                        <div
                                            className="p-6 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                            onClick={() => setExpandedId(expandedId === propuesta.id ? null : propuesta.id)}
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="bg-[#1675BB]/10 text-[#1675BB] font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                                                        {propuesta.area}
                                                    </span>
                                                    <span className={`font-bold text-xs px-3 py-1 rounded-full border ${propuesta.dificultad === 'Fácil' ? 'bg-green-50 text-green-600 border-green-200' : propuesta.dificultad === 'Difícil' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
                                                        {propuesta.dificultad}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold text-[#1D1D1B]">{propuesta.titulo}</h3>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-[#64748B]">
                                                    <span className="flex items-center gap-1.5"><Search className="w-4 h-4"/> Autor: {propuesta.autorId}</span>
                                                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {propuesta.preguntas?.length || 0} Pregunta(s)</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button onClick={(e) => { e.stopPropagation(); handleAction(propuesta.id, 'APROBADO'); }} className="px-5 py-2.5 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981] hover:text-white rounded-xl font-bold transition-all flex items-center gap-2">
                                                    <CheckCircle2 className="w-5 h-5" /> Aprobar
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleAction(propuesta.id, 'RECHAZADO'); }} className="px-5 py-2.5 bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444] hover:text-white rounded-xl font-bold transition-all flex items-center gap-2">
                                                    <XCircle className="w-5 h-5" /> Rechazar
                                                </button>
                                                <div className="ml-2 text-gray-400">
                                                    {expandedId === propuesta.id ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Detalle Expandido (Las Preguntas) */}
                                        <AnimatePresence>
                                            {expandedId === propuesta.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="border-t border-gray-100 bg-[#F8F9FA]"
                                                >
                                                    <div className="p-6 space-y-6">
                                                        {propuesta.preguntas?.map((p, i) => (
                                                            <div key={i} className="bg-white p-5 rounded-xl border border-gray-200">
                                                                <p className="font-bold text-[#1D1D1B] mb-4"><span className="text-[#F28224] mr-2">Q{i+1}.</span>{p.enunciado}</p>
                                                                <div className="space-y-2 pl-6">
                                                                    {p.opciones.map((op, j) => (
                                                                        <div key={j} className={`p-3 rounded-lg flex items-center gap-3 text-sm font-medium ${op.esCorrecta ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-gray-50 border border-transparent text-gray-600'}`}>
                                                                            {op.esCorrecta ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                                                                            {op.texto}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </main>
        </div>
    );
}