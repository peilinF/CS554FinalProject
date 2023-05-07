import "./map.css";

import React, { useState, useEffect, useRef } from "react";

import Directions from "./Directions";
import { GoogleMap, useLoadScript, MarkerF, Autocomplete } from "@react-google-maps/api";

import REACT_APP_GOOGLE_MAPS_API_KEY from "./api_key";
const libraries = ["places"];

const Map = () => {

    const [directions, setDirections] = useState(null);
    const [totalDistance, setTotalDistance] = useState(0);

    const handleTotleDistance = (distance) => {
        setTotalDistance(distance);
    };

    const [distance, setDistance] = useState(0);
    const [generater, setGenerater] = useState(false);

    const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });
    const autocompleteRef = useRef(null);

    // Google Maps API
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const onPlaceSelected = () => {

        setDistance(0);
        setGenerater(false);

        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();

            if (place && place.geometry) {
                const location = place.geometry.location;
                setMapCenter({ lat: location.lat(), lng: location.lng() });
            }
        }
    };

    const findMe = () => {

        // empty all inputs

        setDistance(0);
        setGenerater(false);

        document.querySelector(".autocomplete input").value = "";
        document.querySelector(".autocomplete input").placeholder = "Search location";

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setMapCenter({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            () => {
                alert("Error: Unable to fetch your location.");
            }
        );
    };

    const generatePath = () => {
        setGenerater(true);
    };

    const saveDirections = (directions) => {

        const readDirections = (directions) => {

            // turn directions into a list of locations
            let directionsList = [];
            directions.routes[0].legs.forEach((leg) => {
                leg.steps.forEach((step) => {
                    directionsList.push({
                        lat: step.start_location.lat(),
                        lng: step.start_location.lng(),
                    });
                });
            });
    
            return directionsList;
        };

        console.log(readDirections(directions));
        setDirections(directions);
    };

    const saveDirectionsToLogbook = () => {

        console.log("save directions to user logbook");

    };


    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps";

    let map_html = (
        <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            zoom={13}
            center={mapCenter}
        >
            {generater && (
                <Directions
                    distance={distance}
                    startPoint={mapCenter}
                    handleTotleDistance={handleTotleDistance}
                    saveDirections={saveDirections}
                />
            )}
            <MarkerF
                position={mapCenter}
                onClick={() => {
                    console.log("You are here");
                }}
            />
            {/* {randomLocations.map((location, index) => (
                <MarkerF key={index} position={location} />
            ))} */}

        </GoogleMap>
    );

    let input_html = (
        <div>
            <h3>Select your start point: </h3>
            <Autocomplete
                className="autocomplete"
                onLoad={(autocomplete) => {
                    autocompleteRef.current = autocomplete;
                }}
                onPlaceChanged={onPlaceSelected}
            >
                <input type="text" placeholder="Search location" />
            </Autocomplete>

            <h3>Or use your own location: </h3>

            <button onClick={findMe}>Find me</button>

            <br />

            <h3>Generate random locations: </h3>

            <div>
                <div>
                    <label>
                        Distance (miles):
                        <input
                            id="distance"
                            type="number"
                            placeholder="Distance (mi)"
                            onChange={(e) => {
                                setGenerater(false);
                                setDistance(parseFloat(e.target.value))
                            }}
                        />
                    </label>
                </div>


                {!generater && (<button
                    onClick={() => { generatePath() }}
                >
                    Generate
                </button>)}
                {generater && (<button
                    onClick={() => {
                        // document.querySelector("#distance").value = "";
                        setGenerater(false);
                        // setDistance(0);
                        setTotalDistance(0);
                    }}
                >
                    Clear path
                </button>)}

                <br />
                <br />

                {totalDistance > 0 && (
                    <div>
                        <div>Total distance: {totalDistance.toFixed(2)} mi</div>
                        <button
                            onClick={() => saveDirectionsToLogbook()}
                        >Save to Logbook</button>
                    </div>
                )}
            </div>
        </div>
    );

    let html = (
        <div className="map-page">
            <div className="map-container">{map_html}</div>
            <div className="input-container">{input_html}</div>
        </div>
    );

    return html;
};

export default Map;

