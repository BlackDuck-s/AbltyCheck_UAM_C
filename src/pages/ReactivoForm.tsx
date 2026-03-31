import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { api } from '../services/api'; // TU CONEXIÓN AXIOS

// Usamos el formato estricto que requiere el backend de Emilio
interface Opcion {
  texto: string;
  esCorrecta: boolean;
}

interface Reactivo {
  enunciado: string;
  opciones: Opcion[];
}

export const ReactivoForm: React.FC = () => {
  const [titulo, setTitulo] = useState('');
  const [area, setArea] = useState('');
  const [cargando, setCargando] = useState(false);
  
  // Estado dinámico adaptado a las interfaces reales
  const [preguntas, setPreguntas] = useState<Reactivo[]>([
    { 
      enunciado: '', 
      opciones: [
        { texto: 'Opción A', esCorrecta: true },
        { texto: 'Opción B', esCorrecta: false },
        { texto: 'Opción C', esCorrecta: false }
      ] 
    }
  ]);

  const agregarPregunta = () => {
    setPreguntas([...preguntas, { 
      enunciado: '', 
      opciones: [
        { texto: 'Opción A', esCorrecta: true },
        { texto: 'Opción B', esCorrecta: false },
        { texto: 'Opción C', esCorrecta: false }
      ] 
    }]);
  };

  const manejarCambioPregunta = (index: number, valor: string) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index].enunciado = valor;
    setPreguntas(nuevasPreguntas);
  };

  // --- TU LÓGICA DE CONEXIÓN REAL ---
  const enviarPropuesta = async () => {
    setCargando(true);
    try {
      const propuestaFinal = { titulo, area, preguntas };
      
      // Hacemos el POST al endpoint de Emilio
      await api.post('/evaluaciones', propuestaFinal);
      
      alert("¡Propuesta enviada con éxito al Panel de Admin!");
      
      // Limpiamos el formulario para que quede como nuevo
      setTitulo('');
      setArea('');
      setPreguntas([{ enunciado: '', opciones: [{ texto: 'Opción A', esCorrecta: true }, { texto: 'Opción B', esCorrecta: false }, { texto: 'Opción C', esCorrecta: false }] }]);
      
    } catch (error) {
      console.error(error);
      alert("Error al enviar la propuesta. Asegúrate de que el backend esté encendido.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <Card titulo="Proponer Nueva Evaluación (Crowdsourcing)">
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
          label={cargando ? "Enviando..." : "Enviar Propuesta Completa"} 
          onClick={enviarPropuesta} 
          disabled={!titulo || preguntas[0].enunciado === '' || cargando}
        />
      </div>
    </Card>
  );
};