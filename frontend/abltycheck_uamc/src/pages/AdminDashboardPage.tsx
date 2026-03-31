import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import api from '../config/axiosConfig'; // Nuestro puente de comunicación

// Ajustamos la interfaz para que coincida con lo que devuelve tu backend
interface PropuestaPendiente {
  id: string;
  titulo: string;
  area: string;
  estado: string;
  // Si tu backend no devuelve autor o fecha por ahora, los dejamos como opcionales
  autor?: string; 
  fecha?: string; 
}

export const AdminDashboardPage: React.FC = () => {
  const [listaPendientes, setListaPendientes] = useState<PropuestaPendiente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Se ejecuta automáticamente al abrir la página del Admin
  useEffect(() => {
    cargarEvaluacionesPendientes();
  }, []);

  const cargarEvaluacionesPendientes = async () => {
    try {
      setLoading(true);
      // Llamamos al endpoint que agregamos en EvaluacionController
      const response = await api.get('/evaluaciones/pendientes');
      setListaPendientes(response.data);
    } catch (err) {
      console.error("Error al cargar pendientes:", err);
      setError("No se pudieron cargar las propuestas. Revisa la conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const manejarEstado = async (id: string, nuevoEstado: 'APROBADA' | 'RECHAZADA') => {
    try {
      // Hacemos la petición PUT para cambiar el estado en Firebase
      await api.put(`/evaluaciones/${id}/estado?estado=${nuevoEstado}`);
      
      alert(`Evaluación ${nuevoEstado} con éxito.`);
      
      // Quitamos la evaluación de la tabla visualmente
      setListaPendientes(listaPendientes.filter(item => item.id !== id));
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      alert("Hubo un error al intentar cambiar el estado de la evaluación.");
    }
  };

  return (
    <Card titulo="Panel de Administración: Evaluaciones Pendientes">
      <p style={{ color: '#000', marginBottom: '20px' }}>
        Revisa y modera las propuestas de la comunidad (Crowdsourcing).
      </p>

      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #7d5fff', color: '#333' }}>
              <th style={{ padding: '12px' }}>Título</th>
              <th>Área</th>
              <th>Autor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                  Cargando propuestas pendientes...
                </td>
              </tr>
            ) : listaPendientes.length > 0 ? (
              listaPendientes.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px 12px', fontWeight: '500' }}>{item.titulo}</td>
                  <td>{item.area}</td>
                  <td style={{ fontSize: '14px', color: '#000' }}>
                    {item.autor || 'Comunidad UAM'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button 
                        label="Aprobar" 
                        onClick={() => manejarEstado(item.id, 'APROBADA')} 
                      />
                      <Button 
                        label="Rechazar" 
                        onClick={() => manejarEstado(item.id, 'RECHAZADA')} 
                        variant="secondary" 
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  No hay evaluaciones pendientes por revisar. ¡Todo está al día!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};