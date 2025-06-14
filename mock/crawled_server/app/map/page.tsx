'use client';
import { useEffect } from 'react';

export default function MapPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      const L = (window as any).L;
      const map = L.map('map').setView([35.0, 135.0], 4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <h1>MapTown</h1>
      <div id="map" style={{ height: '400px' }}></div>
    </div>
  );
}
