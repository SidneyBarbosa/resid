import { useEffect } from 'react';
import { useRef } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet.heat'; 
import L from 'leaflet';

const HeatmapLayer = ({ points }) => {
  const map = useMap();
  const heatLayerRef = useRef(null); 

  useEffect(() => {
    if (!points || points.length === 0) {
      if (heatLayerRef.current && map.hasLayer(heatLayerRef.current)) {
        map.removeLayer(heatLayerRef.current);
      }
      return;
    }

    const options = {
      radius: 80,
      blur: 60,
      maxZoom: 18,
      minOpacity: 0.2,
      max: 0.5, 
      gradient: {
        0.4: 'blue',
        0.6: 'cyan',
        0.7: 'lime',
        0.8: 'yellow',
        1.0: 'red'
      }
    };

    if (!heatLayerRef.current) {
      heatLayerRef.current = L.heatLayer(points, options);
      map.addLayer(heatLayerRef.current);
    } else {
      heatLayerRef.current.setLatLngs(points);
      heatLayerRef.current.setOptions(options);
    }

    return () => {
      if (map.hasLayer(heatLayerRef.current)) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [map, points]); 

  return null;
};

export default HeatmapLayer;
