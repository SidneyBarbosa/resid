import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/MapPage.css';

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapPage() {
  const [markers] = useState([
    {
      id: 1,
      position: [-10.9082, -37.0673], // Coordenadas para o primeiro ponto em Aracaju
      title: "Reunião com Lideranças",
      date: "16/07/2025",
      description: "Reunião para discutir propostas de melhoria para o bairro."
    },
    {
      id: 2,
      position: [-10.9120, -37.0700], // Coordenadas para o segundo ponto em Aracaju
      title: "Visita à Comunidade",
      date: "23/07/2025",
      description: "Visita de acompanhamento das obras na comunidade."
    }
  ]);

  return (
    <div className="map-page-container">
      <div className="map-header">
        <h2 className="map-title">Mapa de Ações</h2>
        <p>Ações e eventos em tempo real</p>
      </div>
      <MapContainer
        center={[-10.9167, -37.0500]} // Centro de Aracaju
        zoom={13}
        scrollWheelZoom={false}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map(marker => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>
              <h4>{marker.title}</h4>
              <p>Data: {marker.date}</p>
              <p>{marker.description}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapPage;