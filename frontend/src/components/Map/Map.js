import "./map.css";

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { GoogleMap, useLoadScript, MarkerF, PolylineF } from "@react-google-maps/api";

import { useQuery, useMutation } from '@apollo/client';
import queries from '../../graphql/queries';

const Map = ({ userInfo, logInfo }) => {

    // console.log(userInfo);
    // console.log(logInfo);

    const [page, setPage] = useState("home");

    const location = useLocation();

    const [friends, setFriends] = useState([]);

    const [currentPosition, setCurrentPosition] = useState({
        lat: 40.744838,
        lng: -74.025683
    });

    useQuery(queries.GET_FRIENDS_LIST, {
        variables: { userId: userInfo?._id },
        fetchPolicy: 'cache-and-network',
        skip: !userInfo,
        onCompleted: (data) => {
            setFriends(data.getFriendsList);
        }
    });

    useEffect(() => {

        const fetchPage = () => {

            if (location.pathname === "/") {
                setPage("home");
            } else if (location.pathname === "/runner") {
                setPage("runner");
            }

            if (userInfo && userInfo.lastPosition) {
                setCurrentPosition(userInfo.lastPosition);
            }

        };

        fetchPage();

    }, [userInfo, location.pathname]);

    useEffect(() => {
        if (logInfo) {
            console.log("set current position to log info");
            setCurrentPosition(logInfo.route[0]);
        }
    }, [logInfo]);

    // Google Map

    const { isLoaded, error } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    });

    let html = undefined;

    if (!isLoaded) {
        html = (
            <div>
                <h3>Loading map...</h3>
            </div>
        );
    } else {
        let user_avator_html = (
            <div className='user-avator'>
                {userInfo && userInfo.avatar && (
                    <MarkerF
                        position={userInfo.lastPosition}
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
            </div>
        );

        let frineds_avator_html = (
            <div className='friends-avator'>
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
                    } else {
                        return (
                            <div key={user._id}></div>
                        );
                    }
                })}
            </div>
        );

        if (logInfo) {
            console.log("logInfo: ", logInfo);
        }
        
        let log_html = (
            <div className='loginfo-map'>
                {logInfo && (logInfo.route.length !== 0) && (
                    <div>
                        <PolylineF
                            path={logInfo.route}
                            options={{
                                strokeColor: '#007FFF',
                                strokeOpacity: 1,
                                strokeWeight: 6,
                            }}
                        />
                        <MarkerF
                            position={logInfo.route[0]}
                            onClick={() => console.log("StartPoint")}
                        />
                        <MarkerF
                            position={logInfo.route[logInfo.route.length - 1]}
                            onClick={() => console.log("EndPoint")}
                        />
                    </div>
                )}
            </div>
        );

        try {
            html = (
                <div className="map">
                    <GoogleMap
                        mapContainerClassName='map-container'
                        zoom={15}
                        center={currentPosition}
                    >
                        {user_avator_html}
    
                        {(page === 'home') && frineds_avator_html}
                        {(page === 'runner') && log_html}
                    </GoogleMap>
                </div>
            );
        } catch (error) {
            console.log("Error: Occured when rendering map.");
        }
        
    }

    return html;

};

export default Map;
