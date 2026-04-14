import React from 'react';

// Definimos qué datos necesita recibir cada tarjeta de pregunta
interface ReactivoCardProps {
  enunciado: string;
  opciones: string[];
  id: number;
  onSeleccionar: (preguntaId: number, opcion: string) => void;
}

export const ReactivoCard: React.FC<ReactivoCardProps> = ({ enunciado, opciones, id, onSeleccionar }) => {
  return (
    <div style={{ 
      marginBottom: '25px', 
      padding: '15px', 
      borderRadius: '8px', 
      backgroundColor: '#fafafa',
      border: '1px solid #eee',
      textAlign: 'left'
    }}>
      <h4 style={{ marginTop: 0 }}>{id}. {enunciado}</h4>
      {opciones.map((opcion) => (
        <label key={opcion} style={{ 
          display: 'block', 
          margin: '10px 0', 
          cursor: 'pointer',
          fontSize: '15px'
        }}>
          <input 
            type="radio" 
            name={`pregunta-${id}`} 
            style={{ marginRight: '10px' }}
            onChange={() => onSeleccionar(id, opcion)}
          />
          {opcion}
        </label>
      ))}
    </div>
  );
};