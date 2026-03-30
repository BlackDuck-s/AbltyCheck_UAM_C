import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { api } from '../services/api'; // TU MOTOR DE AXIOS

// Estructura adaptada para recibir los datos reales del back
interface PropuestaPendiente {
  id: string;
  titulo: string;
  area: string;
  autorId: string;
}

export const AdminDashboardPage: React.FC = () => {
  const [listaPendientes, setListaPendientes] = useState<PropuestaPendiente[]>([]);
  const [cargando, setCargando] = useState(true);

  // --- TU LÓGICA DE CONEXIÓN REAL (GET) ---
  // El useEffect hace que esto se ejecute en cuanto el Admin abre la pantalla
  useEffect(() => {
    const cargarPendientes = async () => {
      try {
        // Pegamos al endpoint que hizo Emilio para traer las pendientes
        const response = await api.get('/admin/pendientes');
        setListaPendientes(response.data);
      } catch (error) {
        console.error("Error al cargar pendientes:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarPendientes();
  }, []);

  // --- TU LÓGICA DE MODERACIÓN REAL (PUT) ---
  const manejarEstado = async (id: string, nuevoEstado: 'APROBADA' | 'RECHAZADA') => {
    try {
      // Pegamos al endpoint de Emilio para cambiar el estado en Firestore
      await api.put(`/admin/evaluaciones/${id}/estado`, { estado: nuevoEstado });
      
      alert(`Evaluación ${nuevoEstado} con éxito en la base de datos.`);
      
      // Actualizamos la tabla visualmente quitando la que ya revisamos
      setListaPendientes(listaPendientes.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("Hubo un error al comunicarnos con el servidor.");
    }
  };

  return (
    <Card titulo="Panel de Administración: Evaluaciones Pendientes">
      <p style={{ color: '#000', marginBottom: '20px' }}>
        Revisa y modera las propuestas de la comunidad (Crowdsourcing).
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #007bff', color: '#333' }}>
              <th style={{ padding: '12px' }}>Título</th>
              <th>Área</th>
              <th>ID Autor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                  Cargando propuestas desde el servidor...
                </td>
              </tr>
            ) : listaPendientes.length > 0 ? (
              listaPendientes.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px 12px', fontWeight: '500' }}>{item.titulo}</td>
                  <td>{item.area}</td>
                  <td style={{ fontSize: '14px', color: '#000' }}>{item.autorId}</td>
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
                  No hay evaluaciones pendientes por revisar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};