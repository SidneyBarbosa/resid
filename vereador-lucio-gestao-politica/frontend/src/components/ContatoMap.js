// frontend/src/components/ContatoMap.js
import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {HeatmapLayer} from 'react-leaflet-heatmap-layer-v3'; // <-- Import da biblioteca correta
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41],
  iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const ContatoMap = ({ contatos }) => {
  const [viewMode, setViewMode] = useState('clusters');

  const { points, clusters, heatData } = useMemo(() => {
    const validContatos = contatos.filter(c => c.latitude && c.longitude);
    const points = validContatos;
    const clusters = {};
    validContatos.forEach(contato => {
      const bairro = contato.bairro || 'Sem Bairro';
      if (!clusters[bairro]) {
        clusters[bairro] = { lat: 0, lng: 0, count: 0, contatos: [] };
      }
      clusters[bairro].lat += parseFloat(contato.latitude);
      clusters[bairro].lng += parseFloat(contato.longitude);
      clusters[bairro].count++;
      clusters[bairro].contatos.push(contato.nome_completo);
    });
    
    const clusterArray = Object.keys(clusters).map(bairro => ({
      bairro,
      count: clusters[bairro].count,
      position: [clusters[bairro].lat / clusters[bairro].count, clusters[bairro].lng / clusters[bairro].count],
      contatos: clusters[bairro].contatos
    }));

    const heatData = validContatos.map(c => [parseFloat(c.latitude), parseFloat(c.longitude), 1]);

    return { points, clusters: clusterArray, heatData };
  }, [contatos]);

  return (
    <>
      <div id="map-controls-container" className="map-view-switcher">
        <button onClick={() => setViewMode('points')} className={`switcher-button ${viewMode === 'points' ? 'active' : ''}`}><i className="bi bi-geo-alt-fill"></i> Pontos Individuais</button>
        <button onClick={() => setViewMode('clusters')} className={`switcher-button ${viewMode === 'clusters' ? 'active' : ''}`}><i className="bi bi-pin-map-fill"></i> Contadores por Bairro</button>
        <button onClick={() => setViewMode('heatmap')} className={`switcher-button heatmap-btn ${viewMode === 'heatmap' ? 'active' : ''}`}><i className="bi bi-thermometer-half"></i> Mapa de Calor</button>
      </div>

      <MapContainer center={[-10.9167, -37.0500]} zoom={12} scrollWheelZoom={true} className="leaflet-container">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {viewMode === 'points' && points.map(contato => (
          <Marker key={contato.id} position={[contato.latitude, contato.longitude]}><Popup><h4>{contato.nome_completo}</h4><p><strong>Bairro:</strong> {contato.bairro}</p></Popup></Marker>
        ))}

        {viewMode === 'clusters' && clusters.map(cluster => {
          const clusterIcon = L.divIcon({ html: `<span>${cluster.count}</span>`, className: 'map-cluster-marker', iconSize: [40, 40] });
          return (<Marker key={cluster.bairro} position={cluster.position} icon={clusterIcon}><Popup><h4>{cluster.bairro}</h4><p><strong>{cluster.count}</strong> contatos.</p></Popup></Marker>);
        })}

        {viewMode === 'heatmap' && (
          <HeatmapLayer
            points={heatData}
            longitudeExtractor={m => m[1]}
            latitudeExtractor={m => m[0]}
            intensityExtractor={m => m[2]}
            radius={25}
            blur={15}
          />
        )}
      </MapContainer>
    </>
  );
};

export default ContatoMap;