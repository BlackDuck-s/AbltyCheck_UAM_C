import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { Card } from './Card';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export const RadarSkills: React.FC = () => {
  const data = {
    labels: [
      'Bases de Datos',
      'Estructuras',
      'POO',
      'Algoritmos',
      'Redes',
      'Software',
    ],
    datasets: [
      {
        label: 'Tu Dominio (%)',
        data: [75, 90, 85, 60, 70, 80],
        backgroundColor: 'rgba(125, 95, 255, 0.2)',
        borderColor: '#7d5fff',
        borderWidth: 2,
        pointBackgroundColor: '#7d5fff',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#7d5fff',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: '#eee',
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 25,
          color: '#999',
          backdropColor: 'transparent',
        },
        pointLabels: {
          color: '#333',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <Card titulo="Habilidades por Área">
      <p style={{ color: '#666', marginBottom: '20px', marginTop: 0 }}>
        Tu dominio en cada materia
      </p>
      <div style={{ padding: '10px', maxWidth: '500px', margin: '0 auto' }}>
        <Radar data={data} options={options} />
      </div>
    </Card>
  );
};