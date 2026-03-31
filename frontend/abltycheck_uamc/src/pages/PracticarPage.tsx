import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import api from '../config/axiosConfig'; 
import { ResolverExamenPage } from './ResolverExamenPage';

interface EvaluacionPractica {
  id: string;
  titulo: string;
  area: string;
  estado: string;
  dificultad?: string; 
}

export const PracticarPage: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [evaluaciones, setEvaluaciones] = useState<EvaluacionPractica[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Este es nuestro "switch" para cambiar de pantalla
  const [examenActivoId, setExamenActivoId] = useState<string | null>(null);

  useEffect(() => {
    cargarEvaluacionesAprobadas();
  }, []);

  const cargarEvaluacionesAprobadas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/evaluaciones');
      const soloAprobadas = response.data.filter((eva: EvaluacionPractica) => eva.estado === 'APROBADA');
      setEvaluaciones(soloAprobadas);
    } catch (error) {
      console.error("Error al cargar la biblioteca:", error);
    } finally {
      setLoading(false);
    }
  };

  const evaluacionesFiltradas = evaluaciones.filter(eva => 
    eva.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    eva.area?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // AQUÍ ESTÁ LA MAGIA DEL RETURN ÚNICO
  return (
    <>
      {examenActivoId ? (
        /* PANTALLA 1: Si hay un ID activo, mostramos el examen */
        <ResolverExamenPage 
          evaluacionId={examenActivoId} 
          alTerminar={() => setExamenActivoId(null)} // Esto apaga el ID y nos regresa a la lista
        />
      ) : (
        /* PANTALLA 2: Si el ID es null, mostramos la biblioteca completa */
        <div style={{ animation: 'fadeIn 0.5s' }}>
          <header style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#1a1a1a', marginBottom: '10px' }}>Biblioteca de Práctica</h2>
            <p style={{ color: '#666' }}>Explora y resuelve evaluaciones de todas las áreas de Ingeniería.</p>
          </header>

          <div style={{ marginBottom: '40px', maxWidth: '600px' }}>
            <Input 
              label="Buscar por materia o área académica"
              placeholder="Ej. Redes, Bases de Datos, POO..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
            {loading ? (
              <p style={{ color: '#666', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                Cargando la biblioteca de la UAM-C...
              </p>
            ) : evaluacionesFiltradas.length > 0 ? (
              evaluacionesFiltradas.map(eva => (
                <Card key={eva.id} titulo={eva.titulo}>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
                    <p><strong>Área:</strong> {eva.area}</p>
                    <p><strong>Nivel:</strong> {eva.dificultad || 'Licenciatura'}</p>
                  </div>
                  <Button 
                    label="Empezar Test" 
                    onClick={() => setExamenActivoId(eva.id)} 
                  />
                </Card>
              ))
            ) : (
              <p style={{ color: '#999', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                No se encontraron evaluaciones aprobadas para "{busqueda}"
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};