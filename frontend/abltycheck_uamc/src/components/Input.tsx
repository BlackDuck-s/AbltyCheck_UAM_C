import React from 'react';

interface InputProps {
  label: string;
  type?: 'text' | 'password' | 'number';
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Tipo especial de TS para inputs
  error?: string; // Por si queremos mostrar un mensaje de validación
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange,
  error 
}) => {
  return (
    <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
      <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>{label}</label>
      <input 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          padding: '10px',
          borderRadius: '4px',
          border: error ? '1px solid red' : '1px solid #ccc',
          fontSize: '14px'
        }}
      />
      {error && <span style={{ color: 'red', fontSize: '12px' }}>{error}</span>}
    </div>
  );
};