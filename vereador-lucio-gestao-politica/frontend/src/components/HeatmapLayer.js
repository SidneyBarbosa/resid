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

    // Cria a camada de calor (com as nossas configurações)
    const heatLayer = L.heatLayer(points, {
      radius: 70,
      blur: 30,
      max: 20.0,
      gradient: {
        0.0: '#0000FF', // Azul
        0.4: '#00FFFF', // Ciano
        0.6: '#00FF00', // Verde
        0.8: '#FFFF00', // Amarelo
        1.0: '#FF0000'  // Vermelho
      }
    });

    const timer = setTimeout(() => {
      map.addLayer(heatLayer);
    }, 100); // 100 milissegundos de atraso

    // A "função de limpeza" do useEffect
    return () => {
      clearTimeout(timer); // Limpa o timer se o componente for desmontado
      if (map.hasLayer(heatLayer)) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map, points]); // Re-executa se o mapa ou os pontos mudarem

  return null;
};

export default HeatmapLayer;