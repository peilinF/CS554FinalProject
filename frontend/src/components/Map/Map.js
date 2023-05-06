import "./map.css";

import React, { useState, useEffect, useRef } from "react";

import {
    GoogleMap,
    useLoadScript,
    MarkerF,
    DirectionsRenderer,
    useGoogleMap,
    Autocomplete,
} from "@react-google-maps/api";

const REACT_APP_GOOGLE_MAPS_API_KEY = "AIzaSyBKF_-Lj9BeBzJ1SyMRq0b5qfgdZB3je9o";
const libraries = ["places"];

// Custom hook to access the 'google' object
function useGoogle() {
    const map = useGoogleMap();
    return map ? window.google : null;
}

const Directions = ({ input_distance, locations, handleDistance }) => {
    const [directions, setDirections] = useState(null);
    const directionsService = useRef(null);
    const google = useGoogle();

    const [distance, setDistance] = useState(0);

    const checkIfLegIsWalking = (leg) => {
        return leg.steps.every((step) => step.travel_mode === google.maps.TravelMode.WALKING);
    };    

    const processDirectionsResult = (result) => {
        const filteredLegs = result.routes[0].legs.filter(checkIfLegIsWalking);
    
        if (filteredLegs.length === result.routes[0].legs.length) {
            return result; // All legs are walkable, return the original result
        } else {
            return null;
        }
    };

    useEffect(() => {
        if (google) {
            directionsService.current = new google.maps.DirectionsService();
        }
    }, [google]);

    const getDirections = () => {
        if (!google || !directionsService.current || locations.length < 2) return;

        const waypoints = locations.slice(1, -1).map((location) => ({
            location: new google.maps.LatLng(location.lat, location.lng),
            stopover: true,
        }));

        directionsService.current.route(
            {
                origin: new google.maps.LatLng(locations[0].lat, locations[0].lng),
                destination: new google.maps.LatLng(
                    locations[locations.length - 1].lat,
                    locations[locations.length - 1].lng
                ),
                waypoints: waypoints,
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.WALKING,
                avoidFerries: true,
                avoidHighways: true,
                avoidTolls: true,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {

                    const preocessedResult = processDirectionsResult(result);

                    if (!preocessedResult) {
                        return;
                    }

                    setDirections(result);

                    // Calculate total distance
                    let distance = 0;
                    const myroute = result.routes[0];
                    for (let i = 0; i < myroute.legs.length; i++) {
                        distance += myroute.legs[i].distance.value;
                    }
                    distance = distance / 1000 / 1.60934; // Convert to miles
                    handleDistance(distance);
                    setDistance(distance);
                } else {
                    console.error(`Error fetching directions: ${status}`);
                    if (status === google.maps.DirectionsStatus.ZERO_RESULTS) {
                        alert("No directions found. Try adjusting the starting point or radius, or try update random location.");
                    }
                }
            }
        );
    };


    useEffect(() => {
        getDirections();
    }, [locations]);

    if (directions) {
        console.log(input_distance, distance, Math.abs(input_distance - distance))
        if (input_distance > 0 && Math.abs(input_distance - distance) < (input_distance / 10)) {
            console.log("render path");
            return <DirectionsRenderer directions={directions} />
        }
    }

    return null;
};


const Map = () => {

    const [totalDistance, setTotalDistance] = useState(0);

    const handleDistance = (distance) => {
        setTotalDistance(distance);
    };

    const [counter, setCounter] = useState(0);

    const [numLocations, setNumLocations] = useState(2);
    const [distance, setDistance] = useState(0);
    const [randomLocations, setRandomLocations] = useState([]);

    const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });
    const autocompleteRef = useRef(null);

    // generate random locations

    const generateRandomLocations = () => {

        if (Math.abs(distance - totalDistance) < (distance / 10)) {
            setCounter(0);
            return;
        }; 

        if (counter > 20) {
            alert("No locations found. Try adjusting the starting point or radius, or try update random location.");
            setCounter(0);
            return;
        } else {
            setCounter(counter + 1);
        }

        const locations = [];
        const radius = distance / 3;
        const radiusInKm = radius * 1.60934; // Convert miles to kilometers

        for (let i = 0; i < numLocations; i++) {
            const lat =
                mapCenter.lat +
                (Math.random() * 2 - 1) * (radiusInKm / 111.32);
            const lng =
                mapCenter.lng +
                (Math.random() * 2 - 1) *
                (radiusInKm / (111.32 * Math.cos((mapCenter.lat * Math.PI) / 180)));
            locations.push({ lat, lng });
        }
        setRandomLocations(locations);
    };

    useEffect(() => {
        generateRandomLocations();
    }, [numLocations, distance, totalDistance]);

    // Google Maps API
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const onPlaceSelected = () => {

        // setNumLocations(0);
        setDistance(0);
        // document.querySelector("#num-locations").value = "";
        document.querySelector("#radius").value = "";

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

        // setNumLocations(0);
        setDistance(0);
        document.querySelector(".autocomplete input").value = "";
        document.querySelector(".autocomplete input").placeholder = "Search location";

        // document.querySelector("#num-locations").value = "";
        document.querySelector("#radius").value = "";

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

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps";

    let map_html = (
        <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            zoom={13}
            center={mapCenter}
        >
            {/* <Directions /> */}
            {(randomLocations.length > 0) && (distance > 0) && <Directions input_distance={distance} locations={[mapCenter, ...randomLocations, mapCenter]} handleDistance={handleDistance} />}
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
                {/* <div>
                    <label>
                        Number of locations:
                        <input
                            id="num-locations"
                            type="number"
                            placeholder="Number of locations"
                            onChange={(e) => setNumLocations(parseInt(e.target.value))}
                        />
                    </label>
                </div> */}
                <div>
                    <label>
                        Distance (miles):
                        <input
                            id="radius"
                            type="number"
                            placeholder="Distance (mi)"
                            onChange={(e) => setDistance(parseFloat(e.target.value))}
                        />
                    </label>
                </div>

                <button onClick={() => {
                    setCounter(0);
                    setTotalDistance(0);
                    generateRandomLocations();
                }}>Update</button>

                <br />
                <br />

                {totalDistance > 0 && (
                    <div>Total distance: {totalDistance.toFixed(2)} mi</div>
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

