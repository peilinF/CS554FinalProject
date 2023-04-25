import "./map.css";

import React, { useState, useEffect } from 'react';

import  REACT_APP_GOOGLE_MAPS_API_KEY  from '../../api';
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

const Map = ({ userAvatar }) => {

    // Current Position

    const [currentPosition, setCurrentPosition] = useState({
        lat: 40.744838,
        lng: -74.025683
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => console.log(error)
        );
    }, []);

    // Google Map

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: REACT_APP_GOOGLE_MAPS_API_KEY
    });

    let html = undefined;

    if (!isLoaded) {
        html = (
            <div>
                <h3>Loading map...</h3>
            </div>
        );
    } else {
        html = (
            <div className="map">
                <GoogleMap
                    mapContainerClassName='map-container'
                    zoom={15}
                    center={currentPosition}
                >
                    {userAvatar && (
                        <MarkerF
                            position={currentPosition}
                            icon={{
                                url: userAvatar,
                                scaledSize: new window.google.maps.Size(50, 50)
                            }}
                            onClick={() => console.log("You clicked me!")}
                        />
                    )}
                    {!userAvatar && (
                        <MarkerF
                            position={currentPosition}
                            onClick={() => console.log("You clicked me!")}
                        />
                    )}
                </GoogleMap>
            </div>
        );
    }

    return html;

};

export default Map;
