import React, { useEffect, useRef, useState } from "react";
import AddressAutoComplete from "../components/Forms/AddressAutoComplete";

import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoieWFzaC1yIiwiYSI6ImNsZ3NsMng3bTF1N3UzZXAzNGx2cjF1dGMifQ.jqnN_Nf8g18WlZ_iKJjcrQ";

const HomePage = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [latLng, setLatLng] = useState({ lng: -70.9, lat: 42.35 });
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    console.log("TRI");
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [latLng.lng, latLng.lat],
      zoom: zoom,
    });
  }, []);

  useEffect(() => {
    map.current.jumpTo({
      center: [latLng.lng, latLng.lat],
      zoom: zoom + 3,
    });
    // const marker = new mapboxgl.Marker()
    //   .setLngLat([latLng.lng, latLng.lat])
    //   .addTo(map.current);
  }, [latLng]);

  console.log(latLng);
  return (
    <div>
      <div ref={mapContainer} className="map-container" />
      <AddressAutoComplete latLng={latLng} setLatLng={setLatLng} />
    </div>
  );
};

export default HomePage;
