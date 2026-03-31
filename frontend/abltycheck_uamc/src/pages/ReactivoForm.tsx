import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import api from '../config/axiosConfig'; // ¡Nuestro puente mágico!

// 1. Alineamos las interfaces exactamente con tus DTOs / Entidades de Java
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
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  // 2. Inicializamos con 3 opciones vacías, asignando la primera como correcta por defecto
  const [preguntas, setPreguntas] = useState<Reactivo[]>([
    { 
      enunciado: '', 
      opciones: [
        { texto: '', esCorrecta: true },
        { texto: '', esCorrecta: false },
        { texto: '', esCorrecta: false }
      ] 
    }
  ]);

  const agregarPregunta = () => {
    setPreguntas([
      ...preguntas, 
      { 
        enunciado: '', 
        opciones: [
          { texto: '', esCorrecta: true },
          { texto: '', esCorrecta: false },
          { texto: '', esCorrecta: false }
        ] 
      }
    ]);
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
    // Ponemos todas en false
    nuevasPreguntas[indexPregunta].opciones.forEach(op => op.esCorrecta = false);
    // Ponemos solo la seleccionada en true
    nuevasPreguntas[indexPregunta].opciones[indexOpcionCorrecta].esCorrecta = true;
    setPreguntas(nuevasPreguntas);
  };

  const enviarPropuesta = async () => {
    setLoading(true);
    setMensaje({ texto: '', tipo: '' });

    const propuestaFinal = { 
      titulo, 
      area, 
      estado: "PENDIENTE",
      preguntas 
    };

    try {
      await api.post('/evaluaciones', propuestaFinal);
      
      setMensaje({ texto: '¡Propuesta enviada con éxito al Panel de Admin!', tipo: 'success' });
      setTitulo('');
      setArea('');
      setPreguntas([{ enunciado: '', opciones: [{ texto: '', esCorrecta: true }, { texto: '', esCorrecta: false }, { texto: '', esCorrecta: false }] }]);
      
    } catch (err: any) {
      console.error("Error al enviar evaluación:", err);
      setMensaje({ texto: 'Hubo un error al enviar tu propuesta. Verifica tu conexión.', tipo: 'error' });
    } finally {
      setLoading(false);
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
          placeholder="Ej. Computación, Matemáticas..." 
          value={area} 
          onChange={(e) => setArea(e.target.value)} 
        />
      </div>

      <hr style={{ margin: '20px 0', border: '0.5px solid #eee' }} />

      {preguntas.map((p, indexPregunta) => (
        <div key={indexPregunta} style={{ 
          marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', 
          borderRadius: '8px', borderLeft: '5px solid #7d5fff', color: '#000000'
        }}>
          <h4 style={{ marginTop: 0, marginBottom: '15px' }}>Reactivo #{indexPregunta + 1}</h4>
          
          <div style={{ marginBottom: '15px' }}>
            <Input 
              label="Enunciado de la pregunta" 
              placeholder="¿Qué es un hilo (thread)?" 
              value={p.enunciado}
              onChange={(e) => manejarCambioEnunciado(indexPregunta, e.target.value)}
            />
          </div>

          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', fontSize: '14px' }}>
            Opciones (Selecciona la correcta):
          </label>
          
          {p.opciones.map((opcion, indexOpcion) => (
            <div key={indexOpcion} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              {/* Radio button para elegir la respuesta correcta */}
              <input 
                type="radio" 
                name={`correcta-${indexPregunta}`} 
                checked={opcion.esCorrecta}
                onChange={() => marcarComoCorrecta(indexPregunta, indexOpcion)}
                style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                title="Marcar como respuesta correcta"
              />
              <div style={{ flex: 1 }}>
                <Input 
                  label="" 
                  placeholder={`Opción ${indexOpcion + 1}`} 
                  value={opcion.texto}
                  onChange={(e) => manejarCambioOpcion(indexPregunta, indexOpcion, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Mensajes de éxito o error */}
      {mensaje.texto && (
        <div style={{ 
          padding: '10px', marginBottom: '20px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold',
          backgroundColor: mensaje.tipo === 'success' ? '#d4edda' : '#f8d7da',
          color: mensaje.tipo === 'success' ? '#155724' : '#721c24'
        }}>
          {mensaje.texto}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <Button 
          label="+ Agregar otra pregunta" 
          onClick={agregarPregunta} 
          variant="secondary" 
        />
        <Button 
          label={loading ? "Enviando..." : "Enviar Propuesta Completa"} 
          onClick={enviarPropuesta} 
          disabled={loading || !titulo || !area || preguntas[0].enunciado === ''}
        />
      </div>
    </Card>
  );
};