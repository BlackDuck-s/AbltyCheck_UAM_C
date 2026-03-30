import React from 'react';

interface CardProps {
  titulo?: string;
  children: React.ReactNode; 
}

export const Card: React.FC<CardProps> = ({ titulo, children }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '20px',
      marginBottom: '20px',
      border: '1px solid #eee',
      color: '#000000' // <--- Esto asegura que el texto interno sea negro
    }}>
      {titulo && (
        <h2 style={{ 
          marginTop: 0, 
          borderBottom: '1px solid #eee', 
          paddingBottom: '10px',
          color: '#000000' // <--- ESTE ES EL CAMBIO PARA EL NOMBRE DE LA TARJETA
        }}>
          {titulo}
        </h2>
      )}
      <div style={{ color: '#000000' }}> {/* <--- Refuerzo para el contenido */}
        {children}
      </div>
    </div>
  );
};