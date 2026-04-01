import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import api from '../config/axiosConfig';
// 1. Aquí ya estamos importando la interfaz oficial. ¡Perfecto!
import { RadarSkills, type ResultadoHistorico } from '../components/RadarSkills';

export const EntrenamientoPage: React.FC = () => {
  const [historial, setHistorial] = useState<ResultadoHistorico[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Cargar el historial real al abrir la página
  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const response = await api.get('/historial/mis-resultados');
        setHistorial(response.data);
      } catch (error) {
        console.error("Error al obtener historial:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarHistorial();
  }, []);

  // 2. Función para formatear la fecha de Java (ISO) a algo más humano
  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.5s' }}>
      
      {/* SECCIÓN DE RADAR: Le pasamos el historial para que calcule los promedios */}
      <section>
        <RadarSkills datos={historial} />
      </section>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#1a1a1a', margin: 0, fontSize: '20px', borderLeft: '5px solid #7d5fff', paddingLeft: '15px' }}>
            Actividad Reciente
          </h3>
          <span style={{ color: '#7d5fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Ver todo el historial</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {loading ? (
            <p style={{ textAlign: 'center', gridColumn: '1/-1', color: '#666' }}>Cargando tu progreso...</p>
          ) : historial.length > 0 ? (
            // Mostramos los últimos 4 resultados
            historial.slice(-4).reverse().map((test) => (
              <Card key={test.id} titulo={test.titulo}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                  <p style={{ margin: '5px 0' }}>📅 <strong>Fecha:</strong> {formatearFecha(test.fecha)}</p>
                  <p style={{ margin: '5px 0' }}>🏷️ <strong>Área:</strong> {test.area}</p>
                  <p style={{ margin: '5px 0' }}>⭐ <strong>Nivel:</strong> {test.dificultad || 'Licenciatura'}</p>
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}><strong>Puntaje:</strong> {test.calificacion.toFixed(1)}%</label>
                    <div style={{ width: '100%', backgroundColor: '#eee', borderRadius: '10px', height: '8px' }}>
                      <div style={{ 
                        width: `${test.calificacion}%`, 
                        backgroundColor: test.calificacion >= 80 ? '#58eb9f' : test.calificacion >= 60 ? '#ffc107' : '#ff4d4d', 
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
                  onClick={() => alert("Próximamente: Reporte detallado de respuestas.")} 
                />
              </Card>
            ))
          ) : (
            <p style={{ textAlign: 'center', gridColumn: '1/-1', color: '#999', padding: '40px' }}>
              Aún no has realizado ninguna evaluación. ¡Empieza hoy!
            </p>
          )}
        </div>
      </section>

      {/* BANNER DE ACCIÓN */}
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