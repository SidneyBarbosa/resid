// src/components/HeatmapLayer.js
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet.heat';
import L from 'leaflet';

const HeatmapLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) {
      return;
    }

    const heatLayer = L.heatLayer(points, {
      // --- MUDANÇAS APLICADAS ---

      // 1. RAIO: Aumentado para 40 (ajuste como preferir)
      radius: 40,
      
      // 2. MAX: Este é o ajuste crucial.
      // Define a intensidade máxima. Nossos pontos valem '1'.
      // Aqui, 10 pontos sobrepostos = intensidade máxima.
      max: 10,

      // 3. GRADIENTE: Trocado para HEX para garantir compatibilidade.
      // O gradiente agora será visível.
      gradient: {
        0.0: '#0000FF', // 0% (Baixa intensidade) -> Azul
        0.4: '#00FFFF', // 40% -> Ciano
        0.6: '#00FF00', // 60% -> Verde
        0.8: '#FFFF00', // 80% -> Amarelo
        1.0: '#FF0000'  // 100% (Alta intensidade) -> Vermelho
      }
    });

    map.addLayer(heatLayer);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
};

export default HeatmapLayer;