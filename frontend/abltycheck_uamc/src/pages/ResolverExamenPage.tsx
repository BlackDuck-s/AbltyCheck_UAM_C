import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Target, Award, ArrowLeft } from 'lucide-react';
import api from '../config/axiosConfig';

// Importamos los componentes del nuevo diseño
import { ProblemPanel } from '../components/specific/ProblemPanel';
import { WorkspacePanel } from '../components/specific/WorkspacePanel';

// --- Interfaces del Backend ---
interface Opcion { texto: string; esCorrecta: boolean; }
interface Reactivo { id: string; enunciado: string; opciones: Opcion[]; }
interface Evaluacion { id: string; titulo: string; preguntas: Reactivo[]; area: string; dificultad: string; }
interface Resultado { totalPreguntas: number; aciertos: number; calificacion: number; }

interface Props {
    evaluacionId: string;
    alTerminar: () => void;
}

export const ResolverExamenPage: React.FC<Props> = ({ evaluacionId, alTerminar }) => {
    const [evaluacion, setEvaluacion] = useState<Evaluacion | null>(null);
    const [indice, setIndice] = useState(0);

    // Guardamos el ID del reactivo y el texto de la opción elegida
    const [respuestas, setRespuestas] = useState<Record<string, string>>({});

    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [resultado, setResultado] = useState<Resultado | null>(null);

    // 1. Cargar el examen
    useEffect(() => {
        const cargarExamen = async () => {
            try {
                const response = await api.get(`/evaluaciones/${evaluacionId}`);
                setEvaluacion(response.data);
            } catch (error) {
                console.error("Error al cargar examen", error);
                alert("No se pudo cargar el examen.");
                alTerminar();
            } finally {
                setLoading(false);
            }
        };
        cargarExamen();
    }, [evaluacionId, alTerminar]);

    // 2. Manejar Siguiente Pregunta o Enviar a Spring Boot
    const handleSiguiente = async (textoOpcionElegida: string) => {
        if (!evaluacion) return;

        const reactivoActual = evaluacion.preguntas[indice];
        const nuevasRespuestas = { ...respuestas, [reactivoActual.id]: textoOpcionElegida };
        setRespuestas(nuevasRespuestas);

        if (indice < evaluacion.preguntas.length - 1) {
            // Avanzar de pregunta
            setIndice(indice + 1);
        } else {
            // Terminar examen y enviar a calificar
            setEnviando(true);
            const respuestasFormatoBackend = Object.keys(nuevasRespuestas).map(reactivoId => ({
                reactivoId: reactivoId,
                respuestaSeleccionada: nuevasRespuestas[reactivoId]
            }));

            try {
                const response = await api.post(`/evaluaciones/${evaluacionId}/evaluar`, respuestasFormatoBackend);
                setResultado(response.data);
            } catch (error) {
                console.error("Error al calificar", error);
                alert("Hubo un error al calificar tu examen.");
            } finally {
                setEnviando(false);
            }
        }
    };

    // --- Pantalla de Carga ---
    if (loading) {
        return (
            <div className="fixed inset-0 z-50 bg-[#F8F9FA] flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28224] mb-4"></div>
                <p className="text-[#64748B] font-medium animate-pulse">Preparando entorno de práctica...</p>
            </div>
        );
    }

    // --- Seguridad: Examen sin preguntas ---
    if (!evaluacion || !evaluacion.preguntas || evaluacion.preguntas.length === 0) {
        return (
            <div className="fixed inset-0 z-50 bg-[#F8F9FA] flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-bold text-[#1D1D1B] mb-2">Evaluación Vacía</h2>
                <p className="text-[#64748B] mb-6">Este examen aún no tiene preguntas configuradas.</p>
                <button onClick={alTerminar} className="px-6 py-3 bg-gray-200 rounded-full font-semibold hover:bg-gray-300 transition-colors">Volver</button>
            </div>
        );
    }

    // --- PANTALLA 3: RESULTADOS MODERNOS ---
    if (resultado) {
        const isApproved = resultado.calificacion >= 60;

        return (
            <div className="fixed inset-0 z-50 bg-[#F8F9FA] flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white max-w-lg w-full rounded-[2rem] p-10 shadow-2xl shadow-black/5 text-center relative overflow-hidden"
                >
                    {/* Confetti effect background simple */}
                    <div className={`absolute top-0 left-0 w-full h-2 ${isApproved ? "bg-gradient-to-r from-[#86EFAC] to-[#15803D]" : "bg-gradient-to-r from-[#FCA5A5] to-[#991B1B]"}`} />

                    <div className="flex justify-center mb-6">
                        <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-lg ${isApproved ? "bg-gradient-to-br from-[#DCFCE7] to-[#86EFAC] shadow-[#15803D]/20" : "bg-gradient-to-br from-[#FEE2E2] to-[#FCA5A5] shadow-[#991B1B]/20"}`}>
                            {isApproved ? <Trophy className="w-12 h-12 text-[#15803D]" /> : <Target className="w-12 h-12 text-[#991B1B]" />}
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-[#1D1D1B] mb-2">
                        {isApproved ? "¡Práctica Completada!" : "¡Sigue Practicando!"}
                    </h2>
                    <p className="text-[#64748B] mb-8">Has finalizado la evaluación de {evaluacion.titulo}</p>

                    <div className="bg-[#F8F9FA] rounded-3xl p-6 mb-8 border border-gray-100">
                        <p className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-2">Puntuación Final</p>
                        <div className="flex items-end justify-center gap-2">
              <span className={`text-6xl font-black tracking-tighter ${isApproved ? "text-[#15803D]" : "text-[#991B1B]"}`}>
                {resultado.calificacion.toFixed(0)}
              </span>
                            <span className="text-2xl text-gray-400 font-bold mb-2">/ 100</span>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-around">
                            <div className="text-center">
                                <p className="text-xs text-gray-500 font-medium mb-1">Aciertos</p>
                                <p className="text-lg font-bold text-[#1D1D1B]">{resultado.aciertos}</p>
                            </div>
                            <div className="text-center border-l border-gray-200 pl-8">
                                <p className="text-xs text-gray-500 font-medium mb-1">Total</p>
                                <p className="text-lg font-bold text-[#1D1D1B]">{resultado.totalPreguntas}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={alTerminar}
                        className="w-full py-4 bg-[#F28224] hover:bg-[#D97120] text-white rounded-2xl font-bold text-lg transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                        Volver a la Biblioteca
                    </button>
                </motion.div>
            </div>
        );
    }

    // --- PANTALLA 4: ENTORNO DE PRÁCTICA SPLIT-SCREEN ---
    const preguntaActual = evaluacion.preguntas[indice];

    // Transformamos el formato Opcion (backend) al formato Option (WorkspacePanel)
    const opcionesTransformadas = preguntaActual.opciones.map(opt => ({
        id: opt.texto, // Usamos el texto de la opción como identificador único
        text: opt.texto
    }));

    return (
        <div className="fixed inset-0 z-50 bg-[#F8F9FA] font-['Inter',sans-serif] flex flex-col">
            {/* Top Navigation Bar Mini */}
            <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={alTerminar} className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
                        <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-gray-700" />
                    </button>
                    <div className="h-6 w-px bg-gray-200" />
                    <h1 className="font-bold text-[#1D1D1B]">{evaluacion.titulo}</h1>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
            {evaluacion.area}
          </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#F28224]" />
                        <span className="text-sm font-semibold text-[#64748B]">
              Pregunta {indice + 1} de {evaluacion.preguntas.length}
            </span>
                    </div>
                    {/* Barra de progreso de la cabecera */}
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#F28224] transition-all duration-300"
                            style={{ width: `${((indice + 1) / evaluacion.preguntas.length) * 100}%` }}
                        />
                    </div>
                    <button onClick={alTerminar} className="ml-4 p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Split Screen Area */}
            <main className="flex-1 p-6 overflow-hidden">
                <div className="max-w-[1600px] mx-auto h-full grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Panel Izquierdo: Teoría y Enunciado */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`problem-${indice}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="h-full"
                        >
                            <ProblemPanel
                                title={`Problema ${indice + 1}`}
                                difficulty={evaluacion.dificultad || "Media"}
                                topic={evaluacion.area}
                                timeEstimate="Práctica libre"
                                description={preguntaActual.enunciado}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Panel Derecho: Zona de Trabajo y Opciones */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`workspace-${indice}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="h-full"
                        >
                            <WorkspacePanel
                                question="Selecciona la respuesta que consideres correcta basándote en el enunciado:"
                                options={opcionesTransformadas}
                                isLastQuestion={indice === evaluacion.preguntas.length - 1}
                                isSubmitting={enviando}
                                onNext={handleSiguiente}
                            />
                        </motion.div>
                    </AnimatePresence>

                </div>
            </main>
        </div>
    );
};