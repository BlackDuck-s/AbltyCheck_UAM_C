import React from 'react';
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, disabled, variant }) => {
  const esSecundario = variant === 'secondary';
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      style={{
        padding: '10px 20px',
        backgroundColor: esSecundario ? '#6c757d' : '#007bff',
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