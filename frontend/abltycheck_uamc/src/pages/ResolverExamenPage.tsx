import React, { useState, useEffect } from 'react';
import api from '../config/axiosConfig';

// Interfaces alineadas con tu Backend en Java
interface Opcion { texto: string; esCorrecta: boolean; }
interface Reactivo { id: string; enunciado: string; opciones: Opcion[]; }
interface Evaluacion { id: string; titulo: string; preguntas: Reactivo[]; }
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

  // 1. Cargamos el examen real desde la base de datos al abrir la página
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

  const manejarSeleccion = (reactivoId: string, textoOpcion: string) => {
    setRespuestas({ ...respuestas, [reactivoId]: textoOpcion });
  };

  const siguiente = async () => {
    if (!evaluacion) return;

    if (indice < evaluacion.preguntas.length - 1) {
      setIndice(indice + 1);
    } else {
      // 2. ¡Examen terminado! Empaquetamos las respuestas para Spring Boot
      setEnviando(true);
      const respuestasFormatoBackend = Object.keys(respuestas).map(reactivoId => ({
        reactivoId: reactivoId,
        respuestaSeleccionada: respuestas[reactivoId]
      }));

      try {
        const response = await api.post(`/evaluaciones/${evaluacionId}/evaluar`, respuestasFormatoBackend);
        setResultado(response.data); // Guardamos la calificación que nos devuelve Java
      } catch (error) {
        console.error("Error al calificar", error);
        alert("Hubo un error al calificar tu examen.");
      } finally {
        setEnviando(false);
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando examen...</div>;
  if (!evaluacion || !evaluacion.preguntas || evaluacion.preguntas.length === 0) {
      return <div style={{ textAlign: 'center', marginTop: '50px' }}>Este examen no tiene preguntas.</div>;
  }

  // 3. PANTALLA DE RESULTADOS (Se muestra cuando Java nos devuelve la calificación)
  if (resultado) {
    return (
      <div style={{ maxWidth: '600px', margin: '50px auto', padding: '40px', backgroundColor: 'white', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', animation: 'fadeIn 0.5s' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#1a1a1a' }}>¡Examen Finalizado!</h2>
        <div style={{ fontSize: '4rem', fontWeight: 'bold', color: resultado.calificacion >= 60 ? '#58eb9f' : '#e74c3c', margin: '20px 0' }}>
          {resultado.calificacion.toFixed(1)} / 100
        </div>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
          Tuviste <strong>{resultado.aciertos}</strong> aciertos de <strong>{resultado.totalPreguntas}</strong> preguntas.
        </p>
        <button 
          onClick={alTerminar}
          style={{ padding: '15px 30px', borderRadius: '12px', border: 'none', backgroundColor: '#7d5fff', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}
        >
          Volver a la Biblioteca
        </button>
      </div>
    );
  }

  // 4. PANTALLA DEL EXAMEN
  const preguntaActual = evaluacion.preguntas[indice];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', animation: 'fadeIn 0.5s' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '2px solid #7d5fff', paddingBottom: '10px' }}>
        <h2 style={{ margin: 0, color: '#1a1a1a' }}>{evaluacion.titulo}</h2>
        <span style={{ fontWeight: 'bold', color: '#7d5fff' }}>Pregunta {indice + 1} de {evaluacion.preguntas.length}</span>
      </header>

      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginBottom: '25px', lineHeight: '1.4', color: '#333' }}>{preguntaActual.enunciado}</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {preguntaActual.opciones.map((opcion, i) => (
            <button
              key={i}
              onClick={() => manejarSeleccion(preguntaActual.id, opcion.texto)}
              style={{
                padding: '15px',
                borderRadius: '12px',
                border: respuestas[preguntaActual.id] === opcion.texto ? '2px solid #7d5fff' : '1px solid #ddd',
                backgroundColor: respuestas[preguntaActual.id] === opcion.texto ? '#f0ebff' : 'white',
                color: '#1a1a1a', 
                fontSize: '16px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: '0.2s',
                fontWeight: respuestas[preguntaActual.id] === opcion.texto ? 'bold' : 'normal'
              }}
            >
              {opcion.texto}
            </button>
          ))}
        </div>

        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={siguiente}
            disabled={!respuestas[preguntaActual.id] || enviando}
            style={{
              padding: '12px 30px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: (!respuestas[preguntaActual.id] || enviando) ? '#ccc' : '#58eb9f',
              color: '#1a1a1a', 
              fontWeight: 'bold',
              cursor: (!respuestas[preguntaActual.id] || enviando) ? 'not-allowed' : 'pointer'
            }}
          >
            {enviando ? 'Calificando...' : (indice === evaluacion.preguntas.length - 1 ? 'Finalizar y Calificar' : 'Siguiente Pregunta')}
          </button>
        </div>
      </div>
    </div>
  );
};