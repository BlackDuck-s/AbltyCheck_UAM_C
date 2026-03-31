import React from 'react';
// src/components/Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary'; // Agrega esta línea
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, disabled, variant }) => {
  const esSecundario = variant === 'secondary';
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      style={{
        padding: '10px 20px',
        backgroundColor: esSecundario ? '#6c757d' : '#007bff', // Gris si es secundario
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1
      }}
    >
      {label}
    </button>
  );
};