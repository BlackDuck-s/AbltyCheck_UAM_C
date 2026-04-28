import { useState, useEffect } from 'react';
import { Sidebar } from '../components/layout/sidebar';
import { Search, Edit, Trash2, CheckCircle2, ChevronDown, ChevronUp, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../config/axiosConfig';

interface Opcion { texto: string; esCorrecta: boolean; }
interface Pregunta { enunciado: string; opciones: Opcion[]; }
interface Evaluacion {
    id: string;
    titulo: string;
    area: string;
    dificultad: string;
    autorId: string;
    estado: string;
    preguntas: Pregunta[];
}

export function AdminReactivosPage() {
    const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Evaluacion | null>(null);

    useEffect(() => {
        const fetchAprobadas = async () => {
            try {
                const response = await api.get('/admin/evaluaciones/aprobadas');
                setEvaluaciones(response.data);
            } catch (error) {
                console.error("Error al cargar evaluaciones", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAprobadas();
    }, []);

    const handleDelete = async (id: string, titulo: string) => {
        if (!window.confirm(`¿Estás seguro de eliminar permanentemente la evaluación "${titulo}"?`)) return;
        try {
            await api.delete(`/admin/evaluaciones/${id}`);
            setEvaluaciones(prev => prev.filter(e => e.id !== id));
            alert("Evaluación eliminada.");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            alert("Error al eliminar la evaluación.");
        }
    };

    const handleEditStart = (evaluacion: Evaluacion) => {
        setEditingId(evaluacion.id);
        setEditForm(JSON.parse(JSON.stringify(evaluacion))); // Copia profunda
        setExpandedId(evaluacion.id);
    };

    const handleEditSave = async () => {
        if (!editForm) return;
        try {
            await api.put(`/admin/evaluaciones/${editForm.id}`, editForm);
            setEvaluaciones(prev => prev.map(e => e.id === editForm.id ? editForm : e));
            setEditingId(null);
            setEditForm(null);
            alert("Cambios guardados con éxito.");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            alert("Error al guardar los cambios.");
        }
    };

    const handleQuestionChange = (qIndex: number, newEnunciado: string) => {
        if (!editForm) return;
        const updated = { ...editForm };
        updated.preguntas[qIndex].enunciado = newEnunciado;
        setEditForm(updated);
    };

    const handleOptionChange = (qIndex: number, optIndex: number, newTexto: string) => {
        if (!editForm) return;
        const updated = { ...editForm };
        updated.preguntas[qIndex].opciones[optIndex].texto = newTexto;
        setEditForm(updated);
    };

    const filtered = evaluaciones.filter(e =>
        (e.titulo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.area || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex h-screen bg-[#F8F9FA] items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28224]"></div></div>;

    return (
        <div className="flex h-screen bg-[#F8F9FA] font-['Inter',sans-serif]">
            <Sidebar isAdmin />

            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl text-[#1D1D1B] mb-2" style={{ fontWeight: 700 }}>Gestor de Reactivos 📚</h1>
                            <p className="text-[#64748B]">Edita o elimina contenido público de la plataforma.</p>
                        </div>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" placeholder="Buscar título o área..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#F28224] focus:ring-2 outline-none" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filtered.length === 0 ? (
                            <p className="text-center text-gray-500 py-10">No hay reactivos aprobados disponibles.</p>
                        ) : (
                            filtered.map((evaluacion) => (
                                <motion.div key={evaluacion.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                    {/* Cabecera (Vista normal) */}
                                    <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => editingId !== evaluacion.id && setExpandedId(expandedId === evaluacion.id ? null : evaluacion.id)}>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="bg-[#1675BB]/10 text-[#1675BB] font-bold text-xs px-3 py-1 rounded-full uppercase">{evaluacion.area}</span>
                                                <span className="bg-gray-100 text-gray-600 font-bold text-xs px-3 py-1 rounded-full">{evaluacion.dificultad}</span>
                                            </div>
                                            {editingId === evaluacion.id ? (
                                                <input type="text" value={editForm?.titulo} onChange={(e) => setEditForm(prev => prev ? {...prev, titulo: e.target.value} : null)} className="text-lg font-bold text-[#1D1D1B] bg-white border-b-2 border-[#F28224] outline-none w-full mb-2" />
                                            ) : (
                                                <h3 className="text-lg font-bold text-[#1D1D1B]">{evaluacion.titulo}</h3>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {editingId === evaluacion.id ? (
                                                <>
                                                    <button onClick={(e) => { e.stopPropagation(); handleEditSave(); }} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors" title="Guardar"><Save className="w-5 h-5"/></button>
                                                    <button onClick={(e) => { e.stopPropagation(); setEditingId(null); setEditForm(null); }} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors" title="Cancelar"><X className="w-5 h-5"/></button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={(e) => { e.stopPropagation(); handleEditStart(evaluacion); }} className="p-2 text-gray-400 hover:text-[#F28224] hover:bg-orange-50 rounded-lg transition-colors" title="Editar"><Edit className="w-5 h-5" /></button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(evaluacion.id, evaluacion.titulo); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar"><Trash2 className="w-5 h-5" /></button>
                                                </>
                                            )}
                                            <div className="ml-2 text-gray-400">{expandedId === evaluacion.id ? <ChevronUp /> : <ChevronDown />}</div>
                                        </div>
                                    </div>

                                    {/* Detalles (Preguntas) */}
                                    <AnimatePresence>
                                        {expandedId === evaluacion.id && (
                                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-gray-100 bg-[#F8F9FA] overflow-hidden">
                                                <div className="p-6 space-y-6">
                                                    {(editingId === evaluacion.id ? editForm?.preguntas : evaluacion.preguntas)?.map((p, i) => (
                                                        <div key={i} className="bg-white p-5 rounded-xl border border-gray-200">
                                                            {editingId === evaluacion.id ? (
                                                                <textarea rows={2} value={p.enunciado} onChange={(e) => handleQuestionChange(i, e.target.value)} className="w-full font-bold text-[#1D1D1B] mb-4 p-2 border border-gray-300 rounded-lg focus:border-[#F28224] outline-none" />
                                                            ) : (
                                                                <p className="font-bold text-[#1D1D1B] mb-4"><span className="text-[#F28224] mr-2">Q{i+1}.</span>{p.enunciado}</p>
                                                            )}

                                                            <div className="space-y-2 pl-6">
                                                                {p.opciones.map((op, j) => (
                                                                    <div key={j} className={`p-2 rounded-lg flex items-center gap-3 text-sm font-medium ${op.esCorrecta ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-gray-50 border border-transparent text-gray-600'}`}>
                                                                        {op.esCorrecta ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                                                                        {editingId === evaluacion.id ? (
                                                                            <input type="text" value={op.texto} onChange={(e) => handleOptionChange(i, j, e.target.value)} className="w-full bg-transparent border-b border-gray-300 focus:border-[#F28224] outline-none py-1" />
                                                                        ) : (
                                                                            op.texto
                                                                        )}
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
                    </div>
                </div>
            </main>
        </div>
    );
}