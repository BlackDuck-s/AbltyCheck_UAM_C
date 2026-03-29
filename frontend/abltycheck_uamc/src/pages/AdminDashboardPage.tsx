import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

// Estructura de lo que Axel y Emilio te mandarán desde el Back
interface PropuestaPendiente {
  id: string;
  titulo: string;
  area: string;
  autor: string;
  fecha: string;
}

export const AdminDashboardPage: React.FC = () => {
  // Datos "Mock" para que tu captura de pantalla se vea real hoy mismo
  const [listaPendientes, setListaPendientes] = useState<PropuestaPendiente[]>([
    { id: '101', titulo: 'Redes de Computadoras', area: 'Computación', autor: 'Edgar Morales', fecha: '2026-03-28' },
    { id: '102', titulo: 'Cálculo Vectorial', area: 'Ciencias Básicas', autor: 'Axel G.', fecha: '2026-03-27' },
    { id: '103', titulo: 'Sistemas Operativos', area: 'Computación', autor: 'Emilio R.', fecha: '2026-03-26' }
  ]);

  const manejarEstado = (id: string, nuevoEstado: 'APROBADO' | 'RECHAZADO') => {
    console.log(`Enviando a Emilio: Evaluación ${id} -> ${nuevoEstado}`);
    alert(`Evaluación ${nuevoEstado} con éxito.`);
    
    // Simulamos que la quitamos de la lista después de actuar
    setListaPendientes(listaPendientes.filter(item => item.id !== id));
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
              <th>Autor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {listaPendientes.length > 0 ? (
              listaPendientes.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px 12px', fontWeight: '500' }}>{item.titulo}</td>
                  <td>{item.area}</td>
                  <td style={{ fontSize: '14px', color: '#000' }}>{item.autor}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button 
                        label="Aprobar" 
                        onClick={() => manejarEstado(item.id, 'APROBADO')} 
                      />
                      <Button 
                        label="Rechazar" 
                        onClick={() => manejarEstado(item.id, 'RECHAZADO')} 
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