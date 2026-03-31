import React, { useState } from 'react';

interface Pregunta {
  id: number;
  texto: string;
  opciones: string[];
}

const EXAMEN_MOCK: Pregunta[] = [
  { id: 1, texto: "¿Cuál es la complejidad temporal de Quicksort en el peor caso?", opciones: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"] },
  { id: 2, texto: "¿Qué significa ACID en Bases de Datos?", opciones: ["Atomicity, Consistency, Isolation, Durability", "Access, Control, Index, Data", "Algorithm, Code, Interface, Design"] }
];

export const ResolverExamenPage: React.FC<{ alTerminar: () => void, titulo: string }> = ({ alTerminar, titulo }) => {
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});

  const manejarSeleccion = (opcion: string) => {
    setRespuestas({ ...respuestas, [EXAMEN_MOCK[indice].id]: opcion });
  };

  const siguiente = () => {
    if (indice < EXAMEN_MOCK.length - 1) setIndice(indice + 1);
    else {
      alert("Examen finalizado. Enviando a Firebase...");
      alTerminar();
    }
  };

  const preguntaActual = EXAMEN_MOCK[indice];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', animation: 'fadeIn 0.5s' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '2px solid #7d5fff', paddingBottom: '10px' }}>
        <h2 style={{ margin: 0 }}>{titulo}</h2>
        <span style={{ fontWeight: 'bold', color: '#7d5fff' }}>Pregunta {indice + 1} de {EXAMEN_MOCK.length}</span>
      </header>

      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginBottom: '25px', lineHeight: '1.4' }}>{preguntaActual.texto}</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {preguntaActual.opciones.map((opcion) => (
            <button
              key={opcion}
              onClick={() => manejarSeleccion(opcion)}
              style={{
                padding: '15px',
                borderRadius: '12px',
                border: respuestas[preguntaActual.id] === opcion ? '2px solid #7d5fff' : '1px solid #ddd',
                backgroundColor: respuestas[preguntaActual.id] === opcion ? '#f0ebff' : 'white',
                textAlign: 'left',
                cursor: 'pointer',
                transition: '0.2s',
                fontWeight: respuestas[preguntaActual.id] === opcion ? 'bold' : 'normal'
              }}
            >
              {opcion}
            </button>
          ))}
        </div>

        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={siguiente}
            disabled={!respuestas[preguntaActual.id]}
            style={{
              padding: '12px 30px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: !respuestas[preguntaActual.id] ? '#ccc' : '#58eb9f',
              color: '#1a1a1a',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {indice === EXAMEN_MOCK.length - 1 ? 'Finalizar Examen' : 'Siguiente Pregunta'}
          </button>
        </div>
      </div>
    </div>
  );
};