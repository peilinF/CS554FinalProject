import React, { useEffect, useRef, useState } from "react";

import mapboxgl from "mapbox-gl";

import "./styles.scss";

mapboxgl.accessToken =
  "pk.eyJ1IjoieWFzaC1yIiwiYSI6ImNsZ3NsMng3bTF1N3UzZXAzNGx2cjF1dGMifQ.jqnN_Nf8g18WlZ_iKJjcrQ";

const Map = ({ latLng, setLatLng }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [latLng.lng, latLng.lat],
      zoom: zoom,
    });

    new mapboxgl.Marker()
      .setLngLat([latLng.lng, latLng.lat])
      .addTo(map.current);

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
  }, []);

  useEffect(() => {
    map.current.jumpTo({
      center: [latLng.lng, latLng.lat],
      zoom: parseInt(zoom),
    });
    new mapboxgl.Marker()
      .setLngLat([latLng.lng, latLng.lat])
      .addTo(map.current);
  }, [latLng]);
  return <div ref={mapContainer} className="map-container" />;
};

export default Map;
