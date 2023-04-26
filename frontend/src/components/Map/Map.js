import "./map.css";

import React, { useState, useEffect } from 'react';

import  REACT_APP_GOOGLE_MAPS_API_KEY  from '../../api';
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

import { useQuery, useMutation } from '@apollo/client';
import queries from '../../graphql/queries';

const Map = ({ userInfo }) => {

    // Current Position

    const [currentPosition, setCurrentPosition] = useState({
        lat: 40.744838,
        lng: -74.025683
    });

    const [friends, setFriends] = useState([]);

    const [updateUserPosition] = useMutation(queries.UPDATE_USER_POSITION);

    const { loading, error, data } = useQuery(queries.GET_FRIENDS_LIST, {
        variables: { userId: userInfo?._id },
        fetchPolicy: 'cache-and-network',
        skip: !userInfo,
        onCompleted: (data) => {
            setFriends(data.getFriendsList);
        }
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const random_pos = {
                    lat: position.coords.latitude + (Math.random() - 0.1) * 2,
                    lng: position.coords.longitude + (Math.random() - 0.1) * 2,
                };

                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                let used_pos = random_pos;
                
                setCurrentPosition(used_pos);

                if (userInfo) {
                    await updateUserPosition({ variables: { userId: userInfo._id, position: used_pos } });
                }

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
                    {userInfo && userInfo.avatar && (
                        <MarkerF
                            position={currentPosition}
                            icon={{
                                url: userInfo.avatar,
                                scaledSize: new window.google.maps.Size(75, 75)
                            }}
                            onClick={() => console.log("You clicked me!")}
                        />
                    )}
                    {(!userInfo || !userInfo.avatar) && (
                        <MarkerF
                            position={currentPosition}
                            onClick={() => console.log("You clicked me!")}
                        />
                    )}
                    {friends !== [] && friends.map((user) => {
                        if (user.lastPosition.lat && user.lastPosition.lng) {
                            if (user.avatar) {
                                return (
                                    <MarkerF
                                        key={user._id}
                                        position={user.lastPosition}
                                        icon={{
                                            url: user.avatar,
                                            scaledSize: new window.google.maps.Size(75, 75)
                                        }}
                                        onClick={() => console.log(user.username)}
                                    />
                                );
                            } else {
                                return (
                                    <MarkerF
                                        key={user._id}
                                        position={user.lastPosition}
                                        onClick={() => console.log(user.username)}
                                    />
                                );
                            } 
                        }
                    })}
                </GoogleMap>
            </div>
        );
    }

    return html;

};

export default Map;
