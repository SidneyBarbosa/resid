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

    // Cria a camada de calor (heatmap)
    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 18,
    });

    // Adiciona a camada ao mapa
    map.addLayer(heatLayer);

    // Função de "limpeza": remove a camada quando o componente for desmontado
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]); // O efeito será re-executado se o mapa ou os pontos mudarem

  return null; // Este componente não renderiza nada visível diretamente
};

export default HeatmapLayer;