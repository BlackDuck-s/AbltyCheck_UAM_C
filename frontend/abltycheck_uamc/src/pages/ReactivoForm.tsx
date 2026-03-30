import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface Reactivo {
  enunciado: string;
  opciones: string[];
}

export const ReactivoForm: React.FC = () => {
  const [titulo, setTitulo] = useState('');
  const [area, setArea] = useState('');

  const [preguntas, setPreguntas] = useState<Reactivo[]>([
    { enunciado: '', opciones: ['', '', ''] }
  ]);

  const agregarPregunta = () => {
    setPreguntas([...preguntas, { enunciado: '', opciones: ['', '', ''] }]);
  };

  const manejarCambioPregunta = (index: number, valor: string) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index].enunciado = valor;
    setPreguntas(nuevasPreguntas);
  };

  const enviarPropuesta = () => {
    const propuestaFinal = { titulo, area, preguntas };
    console.log("Datos listos para Axel y Emilio:", propuestaFinal);
    alert("¡Propuesta enviada con éxito al Panel de Admin!");
  };

  return (
    <Card titulo="Proponer Nueva Evaluación (Crowdsourcing)">
      {}
      <div style={{ marginBottom: '20px', color: '#000000' }}>
        <Input 
          label="Título de la Evaluación" 
          placeholder="Ej. Programación Concurrente" 
          value={titulo} 
          onChange={(e) => setTitulo(e.target.value)} 
        />
        <Input 
          label="Área Académica" 
          placeholder="UAM-C Ingeniería" 
          value={area} 
          onChange={(e) => setArea(e.target.value)} 
        />
      </div>

      <hr style={{ margin: '20px 0', border: '0.5px solid #eee' }} />

      {}
      {preguntas.map((p, index) => (
        <div key={index} style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          borderLeft: '5px solid #007bff',
          color: '#000000'
        }}>
          <h4 style={{ marginTop: 0 }}>Reactivo #{index + 1}</h4>
          <Input 
            label="Enunciado de la pregunta" 
            placeholder="¿Qué es un semáforo en MPI?" 
            value={p.enunciado}
            onChange={(e) => manejarCambioPregunta(index, e.target.value)}
          />
          {}
          <p style={{ fontSize: '12px', color: '#000000' }}>* Se incluirán 3 opciones por defecto al enviar.</p>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <Button 
          label="+ Agregar otra pregunta" 
          onClick={agregarPregunta} 
          variant="secondary" 
        />
        <Button 
          label="Enviar Propuesta Completa" 
          onClick={enviarPropuesta} 
          disabled={!titulo || preguntas[0].enunciado === ''}
        />
      </div>
    </Card>
  );
};