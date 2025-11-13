// frontend/src/components/DataMap.js
import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import HeatmapLayer from './HeatmapLayer'; // Reutiliza seu componente
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41],
  iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

const DataMap = ({ data, titleField, dateField, entityName = "registros" }) => {
  const [viewMode, setViewMode] = useState('clusters');

  const { points, clusters, heatData } = useMemo(() => {
    const validData = data ? data.filter(item => item.latitude && item.longitude) : [];
    
    const points = validData;
    
    const clusters = {};
    validData.forEach(item => {
      const bairro = item.bairro || 'Não Informado';
      if (!clusters[bairro]) {
        clusters[bairro] = { lat: 0, lng: 0, count: 0 };
      }
      clusters[bairro].lat += parseFloat(item.latitude);
      clusters[bairro].lng += parseFloat(item.longitude);
      clusters[bairro].count++;
    });
    
    const clusterArray = Object.keys(clusters).map(bairro => ({
      bairro,
      count: clusters[bairro].count,
      position: [clusters[bairro].lat / clusters[bairro].count, clusters[bairro].lng / clusters[bairro].count]
    }));

    // --- MUDANÇA AQUI ---
    // Agora enviamos apenas [lat, lon].
    // O plugin 'leaflet.heat' vai calcular a intensidade sozinho (pela densidade)
    const heatData = validData.map(item => [parseFloat(item.latitude), parseFloat(item.longitude)]);
    // -------------------

    return { points, clusters: clusterArray, heatData };
  }, [data]);


  return (
    <>
      <MapContainer center={[-10.9167, -37.0500]} zoom={12} scrollWheelZoom={true} className="leaflet-container">
        
        <div id="map-controls-container" className="map-view-switcher">
          <button onClick={() => setViewMode('points')} className={`switcher-button ${viewMode === 'points' ? 'active' : ''}`}><i className="bi bi-geo-alt-fill"></i> Pontos Individuais</button>
          <button onClick={() => setViewMode('clusters')} className={`switcher-button ${viewMode === 'clusters' ? 'active' : ''}`}><i className="bi bi-pin-map-fill"></i> Contadores por Bairro</button>
          <button onClick={() => setViewMode('heatmap')} className={`switcher-button heatmap-btn ${viewMode === 'heatmap' ? 'active' : ''}`}><i className="bi bi-thermometer-half"></i> Mapa de Calor</button>
        </div>
        
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {viewMode === 'points' && points.map(item => (
          <Marker key={item.id} position={[item.latitude, item.longitude]}>
            <Popup>
              <h4>{item[titleField]}</h4> 
              <p><strong>Bairro:</strong> {item.bairro}</p>
              {dateField && <p><strong>Data:</strong> {formatDate(item[dateField])}</p>}
            </Popup>
          </Marker>
        ))}

        {viewMode === 'clusters' && clusters.map(cluster => {
          const clusterIcon = L.divIcon({ html: `<span>${cluster.count}</span>`, className: 'map-cluster-marker', iconSize: [40, 40] });
          return (
            <Marker key={cluster.bairro} position={cluster.position} icon={clusterIcon}>
              <Popup>
                <h4>{cluster.bairro}</h4>
                <p><strong>{cluster.count}</strong> {entityName} neste bairro.</p>
              </Popup>
            </Marker>
          );
        })}

        {/* Agora o HeatmapLayer vai receber [lat, lon] e funcionar */}
        {viewMode === 'heatmap' && (
          <HeatmapLayer points={heatData} />
        )}
        
      </MapContainer>
    </>
  );
};

export default DataMap;