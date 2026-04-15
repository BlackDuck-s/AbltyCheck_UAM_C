import { useState } from 'react';
import { Sidebar } from '../components/layout/sidebar';
import { Plus, Send, AlertCircle, CheckCircle2, Trash2, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../config/axiosConfig';
import { AxiosError } from 'axios';

interface Opcion {
    texto: string;
    esCorrecta: boolean;
}

interface Reactivo {
    enunciado: string;
    opciones: Opcion[];
    areaConocimiento?: string;
    dificultad?: string;
    autorId?: string;
}

export function CrowdsourcingPage() {
    const [titulo, setTitulo] = useState('');
    const [area, setArea] = useState('Bases de Datos');
    const [dificultad, setDificultad] = useState('Media');
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    const [preguntas, setPreguntas] = useState<Reactivo[]>([
        { enunciado: '', opciones: [{ texto: '', esCorrecta: true }, { texto: '', esCorrecta: false }, { texto: '', esCorrecta: false }] }
    ]);

    const obtenerMatriculaDelToken = () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return 'Anónimo';
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.sub || 'Anónimo';
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            return 'Anónimo';
        }
    };

    const agregarPregunta = () => {
        setPreguntas([...preguntas, { enunciado: '', opciones: [{ texto: '', esCorrecta: true }, { texto: '', esCorrecta: false }, { texto: '', esCorrecta: false }] }]);
    };

    const eliminarPregunta = (indexPregunta: number) => {
        if (preguntas.length === 1) return; // No permitimos borrar si solo queda una
        const nuevasPreguntas = preguntas.filter((_, i) => i !== indexPregunta);
        setPreguntas(nuevasPreguntas);
    };

    const manejarCambioEnunciado = (indexPregunta: number, valor: string) => {
        const nuevasPreguntas = [...preguntas];
        nuevasPreguntas[indexPregunta].enunciado = valor;
        setPreguntas(nuevasPreguntas);
    };

    const manejarCambioOpcion = (indexPregunta: number, indexOpcion: number, texto: string) => {
        const nuevasPreguntas = [...preguntas];
        nuevasPreguntas[indexPregunta].opciones[indexOpcion].texto = texto;
        setPreguntas(nuevasPreguntas);
    };

    const marcarComoCorrecta = (indexPregunta: number, indexOpcionCorrecta: number) => {
        const nuevasPreguntas = [...preguntas];
        nuevasPreguntas[indexPregunta].opciones.forEach(op => op.esCorrecta = false);
        nuevasPreguntas[indexPregunta].opciones[indexOpcionCorrecta].esCorrecta = true;
        setPreguntas(nuevasPreguntas);
    };

    const enviarPropuesta = async () => {
        setLoading(true);
        setMensaje({ texto: '', tipo: '' });

        const autorActual = obtenerMatriculaDelToken();

        const preguntasCompletas = preguntas.map(p => ({
            ...p,
            areaConocimiento: area,
            dificultad: dificultad,
            autorId: autorActual
        }));

        const propuestaFinal = {
            titulo,
            area,
            dificultad,
            autorId: autorActual,
            estado: "PENDIENTE",
            preguntas: preguntasCompletas
        };

        try {
            await api.post('/evaluaciones', propuestaFinal);
            setMensaje({ texto: '¡Propuesta enviada con éxito! Los administradores la revisarán pronto.', tipo: 'success' });
            setTitulo('');
            setArea('Bases de Datos');
            setDificultad('Media');
            setPreguntas([{ enunciado: '', opciones: [{ texto: '', esCorrecta: true }, { texto: '', esCorrecta: false }, { texto: '', esCorrecta: false }] }]);

            // Limpiar mensaje después de 5 segundos
            setTimeout(() => setMensaje({ texto: '', tipo: '' }), 5000);
        } catch (err) {
            const axiosError = err as AxiosError<{ mensaje: string }>;
            setMensaje({ texto: axiosError.response?.data?.mensaje || 'Hubo un error al enviar tu propuesta. Verifica tu conexión.', tipo: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#F8F9FA] font-['Inter',sans-serif]">
            <Sidebar />

            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl text-[#1D1D1B] mb-2" style={{ fontWeight: 700 }}>
                            Crowdsourcing 🤝
                        </h1>
                        <p className="text-[#64748B]">Colabora con la comunidad proponiendo nuevas evaluaciones.</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                    >
                        {/* Mensajes de Alerta */}
                        <AnimatePresence>
                            {mensaje.texto && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    className={`flex items-center gap-3 p-4 rounded-2xl ${mensaje.tipo === 'success' ? 'bg-[#86EFAC]/20 text-[#15803D] border border-[#86EFAC]/40' : 'bg-[#FCA5A5]/20 text-[#991B1B] border border-[#FCA5A5]/40'}`}
                                >
                                    {mensaje.tipo === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                                    <span className="font-medium text-sm">{mensaje.texto}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Configuración General */}
                        <div className="mb-8">
                            <h2 className="text-lg font-bold text-[#1D1D1B] mb-4 flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-[#F28224]" /> Configuración General
                            </h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-[#334155] mb-2">Título de la Evaluación</label>
                                    <input
                                        type="text"
                                        placeholder="Ej. Diseño de Algoritmos Voraces"
                                        value={titulo}
                                        onChange={(e) => setTitulo(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-200 rounded-xl focus:border-[#F28224] focus:ring-2 focus:ring-[#F28224]/20 outline-none transition-all text-[#1D1D1B]"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#334155] mb-2">Área Académica</label>
                                        <select
                                            value={area}
                                            onChange={(e) => setArea(e.target.value)}
                                            className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-200 rounded-xl focus:border-[#F28224] outline-none text-[#1D1D1B] appearance-none cursor-pointer"
                                        >
                                            <option value="Bases de Datos">Bases de Datos</option>
                                            <option value="Estructuras">Estructuras</option>
                                            <option value="POO">POO</option>
                                            <option value="Algoritmos">Algoritmos</option>
                                            <option value="Redes">Redes</option>
                                            <option value="Ing. Software">Ing. Software</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#334155] mb-2">Dificultad</label>
                                        <select
                                            value={dificultad}
                                            onChange={(e) => setDificultad(e.target.value)}
                                            className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-200 rounded-xl focus:border-[#F28224] outline-none text-[#1D1D1B] appearance-none cursor-pointer"
                                        >
                                            <option value="Fácil">Fácil</option>
                                            <option value="Media">Media</option>
                                            <option value="Difícil">Difícil</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 my-8" />

                        {/* Lista de Reactivos */}
                        <div>
                            <h2 className="text-lg font-bold text-[#1D1D1B] mb-6">Reactivos</h2>

                            <div className="space-y-6">
                                {preguntas.map((p, indexPregunta) => (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        key={indexPregunta}
                                        className="p-6 bg-[#F8F9FA] rounded-2xl border border-gray-200 relative group"
                                    >
                                        {/* Header del Reactivo */}
                                        <div className="flex justify-between items-center mb-4">
                      <span className="bg-[#F28224]/10 text-[#F28224] font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                        Pregunta {indexPregunta + 1}
                      </span>
                                            {preguntas.length > 1 && (
                                                <button
                                                    onClick={() => eliminarPregunta(indexPregunta)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
                                                    title="Eliminar pregunta"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="mb-5">
                                            <label className="block text-sm font-semibold text-[#334155] mb-2">Enunciado</label>
                                            <textarea
                                                rows={3}
                                                placeholder="Ej. ¿Cuál es el propósito del patrón Singleton?"
                                                value={p.enunciado}
                                                onChange={(e) => manejarCambioEnunciado(indexPregunta, e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#F28224] focus:ring-2 focus:ring-[#F28224]/20 outline-none transition-all text-[#1D1D1B] resize-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-[#334155] mb-3">Opciones (Marca la correcta)</label>
                                            <div className="space-y-3">
                                                {p.opciones.map((opcion, indexOpcion) => (
                                                    <div
                                                        key={indexOpcion}
                                                        className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${opcion.esCorrecta ? 'bg-[#86EFAC]/20 border border-[#86EFAC]/40' : 'bg-white border border-gray-200'}`}
                                                    >
                                                        <div className="pl-3">
                                                            <input
                                                                type="radio"
                                                                name={`correcta-${indexPregunta}`}
                                                                checked={opcion.esCorrecta}
                                                                onChange={() => marcarComoCorrecta(indexPregunta, indexOpcion)}
                                                                className="w-5 h-5 accent-[#15803D] cursor-pointer"
                                                            />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder={`Opción ${indexOpcion + 1}`}
                                                            value={opcion.texto}
                                                            onChange={(e) => manejarCambioOpcion(indexPregunta, indexOpcion, e.target.value)}
                                                            className="w-full px-2 py-2 bg-transparent outline-none text-[#334155] placeholder-gray-400 font-medium"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-100">
                                <button
                                    onClick={agregarPregunta}
                                    className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-[#F28224] bg-[#F28224]/10 hover:bg-[#F28224]/20 transition-colors sm:w-auto"
                                >
                                    <Plus className="w-5 h-5" /> Añadir Pregunta
                                </button>
                                <button
                                    onClick={enviarPropuesta}
                                    disabled={loading || !titulo || preguntas[0].enunciado === ''}
                                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-[#F28224] hover:bg-[#D97120] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed sm:ml-auto"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                    Enviar Propuesta
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}