import React, { useState } from 'react';

interface PracticarProps {
  alSeleccionarExamen: (titulo: string) => void;
}

const EVALUACIONES_BASE = [
  { id: 1, titulo: 'Bases de Datos I', area: 'Sistemas', dificultad: 'Básica' },
  { id: 2, titulo: 'Redes de Computadoras', area: 'Redes', dificultad: 'Intermedia' },
  { id: 3, titulo: 'Programación Orientada a Objetos', area: 'Software', dificultad: 'Avanzada' },
  { id: 4, titulo: 'Estructuras de Datos', area: 'Software', dificultad: 'Intermedia' },
];

export const PracticarPage: React.FC<PracticarProps> = ({ alSeleccionarExamen }) => {
  const [busqueda, setBusqueda] = useState('');

  const filtrados = EVALUACIONES_BASE.filter(ev => 
    ev.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    ev.area.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ animation: 'fadeIn 0.5s', width: '100%' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: 0 }}>Biblioteca de Evaluaciones</h2>
        <p style={{ color: '#666' }}>Selecciona una materia para poner a prueba tus conocimientos.</p>
      </div>

      <div style={{ maxWidth: '500px', marginBottom: '40px' }}>
        <input 
          type="text"
          placeholder="Buscar evaluación..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid #ddd',
            fontSize: '16px'
          }}
        />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '20px',
        width: '100%'
      }}>
        {filtrados.map(ev => (
          <div key={ev.id} style={cardStyle}>
            <h3 style={{ margin: '0 0 10px 0', color: '#1a1a1a' }}>{ev.titulo}</h3>
            <p style={{ fontSize: '14px', color: '#888' }}>Área: <strong>{ev.area}</strong></p>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '20px' }}>Dificultad: {ev.dificultad}</p>
            <button 
              onClick={() => alSeleccionarExamen(ev.titulo)}
              style={btnStyle}
            >
              Iniciar Test
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const cardStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '15px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  display: 'flex',
  flexDirection: 'column' as const
};

const btnStyle = {
  padding: '12px',
  borderRadius: '10px',
  border: 'none',
  backgroundColor: '#58eb9f',
  color: '#1a1a1a',
  fontWeight: 'bold' as const,
  cursor: 'pointer',
  marginTop: 'auto'
};