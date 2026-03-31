import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

const TODAS_LAS_EVALUACIONES = [
  { id: 1, titulo: 'Bases de Datos I', area: 'Bases de Datos', dificultad: 'Básica' },
  { id: 2, titulo: 'Redes Locales', area: 'Redes', dificultad: 'Intermedia' },
  { id: 3, titulo: 'POO Avanzada', area: 'POO', dificultad: 'Avanzada' },
  { id: 4, titulo: 'Estructuras Lineales', area: 'Estructuras', dificultad: 'Básica' },
  { id: 5, titulo: 'Cálculo Diferencial', area: 'Matemáticas', dificultad: 'Avanzada' },
  { id: 6, titulo: 'Sistemas Operativos', area: 'Software', dificultad: 'Intermedia' },
];

export const PracticarPage: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');


  const evaluacionesFiltradas = TODAS_LAS_EVALUACIONES.filter(eva => 
    eva.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    eva.area.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ animation: 'fadeIn 0.5s' }}>
      <header style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#1a1a1a', marginBottom: '10px' }}>Biblioteca de Práctica</h2>
        <p style={{ color: '#666' }}>Explora y resuelve evaluaciones de todas las áreas de Ingeniería.</p>
      </header>

      {}
      <div style={{ marginBottom: '40px', maxWidth: '600px' }}>
        <Input 
          label="Buscar por materia o área académica"
          placeholder="Ej. Redes, Bases de Datos, POO..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '25px' 
      }}>
        {evaluacionesFiltradas.length > 0 ? (
          evaluacionesFiltradas.map(eva => (
            <Card key={eva.id} titulo={eva.titulo}>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
                <p><strong>Área:</strong> {eva.area}</p>
                <p><strong>Nivel:</strong> {eva.dificultad}</p>
              </div>
              <Button label="Empezar Test" onClick={() => alert(`Iniciando ${eva.titulo}`)} />
            </Card>
          ))
        ) : (
          <p style={{ color: '#999', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            No se encontraron evaluaciones que coincidan con "{busqueda}"
          </p>
        )}
      </div>
    </div>
  );
};