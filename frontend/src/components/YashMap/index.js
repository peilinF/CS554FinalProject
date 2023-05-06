import React, { useEffect, useRef, useState } from "react";

import mapboxgl from "mapbox-gl";

import "./styles.scss";
import { mapApiInstance } from "../../utils/mapApiInstance";

mapboxgl.accessToken =
  "pk.eyJ1IjoieWFzaC1yIiwiYSI6ImNsZ3NsMng3bTF1N3UzZXAzNGx2cjF1dGMifQ.jqnN_Nf8g18WlZ_iKJjcrQ";

const Map = ({ latLng, setLatLng, destLatLng }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [zoom, setZoom] = useState(13);

  async function getRoute(dest) {
    // make a directions request using cycling profile
    // an arbitrary start will always be the same
    // only the end or destination will change

    let wayptsStr = "";
    destLatLng.forEach((o) => {
      wayptsStr = wayptsStr.concat(o.lng + "," + o.lat + ";");
    });
    console.log(wayptsStr);
    const query = await mapApiInstance.get(
      `/${latLng.lng},${latLng.lat};
      ${wayptsStr}
      ${latLng.lng},${latLng.lat}
      ?steps=true&geometries=geojson`
    );
    const json = await query.data;
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const geojson = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: route,
      },
    };
    // if the route already exists on the map, we'll reset it using setData
    if (map.current.getSource("route")) {
      map.current.getSource("route").setData(geojson);
    }
    // otherwise, we'll make a new request
    else {
      map.current.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: geojson,
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3887be",
          "line-width": 5,
          "line-opacity": 0.75,
        },
      });
    }
    // add turn instructions here at the end

    // get the sidebar and add the instructions
    // const instructions = document.getElementById("instructions");
    // const steps = data.legs[0].steps;

    // let tripInstructions = "";
    // for (const step of steps) {
    //   tripInstructions += `<li>${step.maneuver.instruction}</li>`;
    // }
    // instructions.innerHTML = `<p><strong>Trip duration: ${Math.floor(
    //   data.duration / 60
    // )} min 🚴 </strong></p><ol>${tripInstructions}</ol>`;
  }

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [latLng.lng, latLng.lat],
      zoom: zoom,
    });

    map.current.marker = new mapboxgl.Marker()
      .setLngLat([latLng.lng, latLng.lat])
      .addTo(map.current);

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
  }, []);

  useEffect(() => {
    map.current.jumpTo({
      center: [latLng.lng, latLng.lat],
      zoom: parseInt(zoom),
    });
    map.current.marker = map.current.marker
      .setLngLat([latLng.lng, latLng.lat])
      .addTo(map.current);
  }, [latLng]);

  useEffect(() => {
    if (destLatLng == null) return;
    let start = [latLng.lng, latLng.lat];
    console.log(start);

    if (map.current) {
      // make an initial directions request that
      // starts and ends at the same location
      getRoute(destLatLng);

      if (map.current.getLayer("point")) {
        map.current.removeLayer("point");
        map.current.removeSource("point");
      }

      map.current.jumpTo({
        zoom: zoom + 1,
      });

      // Add starting point to the map
      map.current.addLayer({
        id: "point",
        type: "circle",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Point",
                  coordinates: start,
                },
              },
            ],
          },
        },
        paint: {
          "circle-radius": 10,
          "circle-color": "#3887be",
        },
      });
      // this is where the code from the next step will go
    }
  }, [destLatLng]);

  return <div ref={mapContainer} className="map-container" />;
};

export default Map;
