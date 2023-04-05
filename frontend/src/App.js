// test for google maps api

import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

import google_maps_api_key from './config.js';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 40.7128,
  lng: -74.0060
};

let html = (
  <div>
      <LoadScript googleMapsApiKey={google_maps_api_key}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
    </div>
);

function App() {
  return html;
}

export default App;
