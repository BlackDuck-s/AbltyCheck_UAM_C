import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { RadarSkills } from '../components/RadarSkills';

const actividadReciente = [
  { id: 101, titulo: 'Examen Diagnóstico: Bases de Datos', fecha: '30 Mar, 2026', puntaje: 85, area: 'Bases de Datos' },
  { id: 102, titulo: 'Quiz: Programación Orientada a Objetos', fecha: '28 Mar, 2026', puntaje: 92, area: 'POO' },
  { id: 103, titulo: 'Práctica: Estructuras de Datos Lineales', fecha: '25 Mar, 2026', puntaje: 70, area: 'Estructuras' },
  { id: 104, titulo: 'Evaluación: Algoritmos de Ordenamiento', fecha: '22 Mar, 2026', puntaje: 65, area: 'Algoritmos' },
];

export const EntrenamientoPage: React.FC = () => {
  
  const verResultados = (id: number) => {
    console.log(`Consultando resultados del test: ${id}`);
    alert("Abriendo reporte de retroalimentación...");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.5s' }}>
      
      {}
      <section>
        <RadarSkills />
      </section>

      {}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#1a1a1a', margin: 0, fontSize: '20px', borderLeft: '5px solid #7d5fff', paddingLeft: '15px' }}>
            Actividad Reciente
          </h3>
          <span style={{ color: '#7d5fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Ver todo el historial</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {actividadReciente.map((test) => (
            <Card key={test.id} titulo={test.titulo}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                <p style={{ margin: '5px 0' }}>📅 <strong>Fecha:</strong> {test.fecha}</p>
                <p style={{ margin: '5px 0' }}>🏷️ <strong>Área:</strong> {test.area}</p>
                <div style={{ marginTop: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}><strong>Puntaje:</strong> {test.puntaje}%</label>
                  {}
                  <div style={{ width: '100%', backgroundColor: '#eee', borderRadius: '10px', height: '8px' }}>
                    <div style={{ 
                      width: `${test.puntaje}%`, 
                      backgroundColor: test.puntaje >= 80 ? '#58eb9f' : test.puntaje >= 70 ? '#ffc107' : '#ff4d4d', 
                      height: '100%', 
                      borderRadius: '10px',
                      transition: 'width 1s ease-in-out'
                    }}></div>
                  </div>
                </div>
              </div>
              
              <Button 
                label="Revisar Detalles" 
                variant="secondary"
                onClick={() => verResultados(test.id)} 
              />
            </Card>
          ))}
        </div>
      </section>

      {}
      <div style={{ 
        backgroundColor: '#7d5fff', 
        padding: '30px', 
        borderRadius: '20px', 
        color: 'white', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 10px 20px rgba(125, 95, 255, 0.3)'
      }}>
        <div>
          <h3 style={{ margin: 0 }}>¿Listo para mejorar tu score?</h3>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Inicia una nueva evaluación basada en tus áreas débiles.</p>
        </div>
        <button style={{ 
          backgroundColor: '#58eb9f', 
          color: '#1a1a1a', 
          border: 'none', 
          padding: '12px 25px', 
          borderRadius: '12px', 
          fontWeight: 'bold', 
          cursor: 'pointer' 
        }}>
          Nueva Evaluación
        </button>
      </div>

    </div>
  );
};