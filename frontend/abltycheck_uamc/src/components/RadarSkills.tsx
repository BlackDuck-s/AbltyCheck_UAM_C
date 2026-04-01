import React from 'react';
import {
  Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';

// 1. AQUÍ EXPORTAMOS LA INTERFAZ EXACTA QUE NECESITA LA OTRA PÁGINA
export interface ResultadoHistorico {
  id: string;
  titulo: string;
  area: string;
  calificacion: number;
  fecha: string;
  dificultad?: string;
}

// 2. LE DECIMOS A REACT QUE ESTE COMPONENTE RECIBE UN ARREGLO DE ESOS DATOS
interface Props {
  datos: ResultadoHistorico[];
}

// 3. RECIBIMOS LOS "datos" EN EL COMPONENTE
export const RadarSkills: React.FC<Props> = ({ datos }) => {
  
  const AREAS_UAM = [
    'Bases de Datos', 
    'Estructuras', 
    'POO', 
    'Algoritmos', 
    'Redes', 
    'Software'
  ];

  const procesarDatosParaRadar = () => {
    // Si no hay datos (aún está cargando), devolvemos el radar en 0
    if (!datos || datos.length === 0) {
      return AREAS_UAM.map(area => ({ subject: area, A: 0, fullMark: 100 }));
    }

    return AREAS_UAM.map(area => {
      const examenesArea = datos.filter(d => d.area === area);
      const promedio = examenesArea.length > 0 
        ? examenesArea.reduce((acc, curr) => acc + curr.calificacion, 0) / examenesArea.length
        : 0;

      return {
        subject: area,
        A: promedio,
        fullMark: 100,
      };
    });
  };

  const chartData = procesarDatosParaRadar();

  return (
    <div style={{ 
      width: '100%', 
      height: '400px', 
      backgroundColor: 'white', 
      borderRadius: '20px', 
      padding: '20px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
    }}>
      <h3 style={{ color: '#1a1a1a', marginBottom: '20px', textAlign: 'center' }}>
        Habilidades por Área
      </h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#eee" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#666', fontSize: 12, fontWeight: 'bold' }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={false} 
            axisLine={false} 
          />
          <Radar
            name="Mi Nivel"
            dataKey="A"
            stroke="#7d5fff"
            strokeWidth={3}
            fill="#7d5fff"
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      <p style={{ textAlign: 'center', color: '#999', fontSize: '12px', marginTop: '10px' }}>
        Tu dominio en cada materia basado en tus últimos exámenes.
      </p>
    </div>
  );
};