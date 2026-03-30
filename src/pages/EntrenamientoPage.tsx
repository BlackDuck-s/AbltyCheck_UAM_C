import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
//import { ReactivoCard } from '../components/ReactivoCard';

// 1. Datos de prueba (Imagina que esto te lo mandó el Back de Emilio)
const examenPrueba = [
  { id: 1, enunciado: "¿Qué motor tiene el Seat Toledo 2003?", opciones: ["1.8 20v", "2.0 Turbo", "1.6"] },
  { id: 2, enunciado: "¿Cuál es la capital de México?", opciones: ["CDMX", "Guadalajara", "Monterrey"] }
];

export const EntrenamientoPage: React.FC = () => {
  // Estado para guardar qué contestó el usuario en cada pregunta
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});

  return (
    <Card titulo="Sesión de Entrenamiento">
      <p>Responde todas las preguntas antes de finalizar.</p>

      {/* ESTO ES EL PUNTO 2: ITERAR SOBRE LA LISTA */}
      {examenPrueba.map((pregunta, index) => (
        <div key={pregunta.id} style={{ marginBottom: '20px', borderBottom: '1px solid #eee' }}>
          <h4>{index + 1}. {pregunta.enunciado}</h4>
          {pregunta.opciones.map(opcion => (
            <label key={opcion} style={{ display: 'block', margin: '5px 0' }}>
              <input 
                type="radio" 
                name={`pregunta-${pregunta.id}`} 
                onChange={() => setRespuestas({...respuestas, [pregunta.id]: opcion})}
              />
              {opcion}
            </label>
          ))}
        </div>
      ))}

      <Button 
        label="Enviar Evaluación" 
        onClick={() => console.log(respuestas)} 
        disabled={Object.keys(respuestas).length < examenPrueba.length}
      />
    </Card>
  );
};