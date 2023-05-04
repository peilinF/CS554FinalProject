import "./map.css";
import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { GoogleMap, useLoadScript, MarkerF, PolylineF } from "@react-google-maps/api";
import { useQuery } from "@apollo/client";
import queries from "../../graphql/queries";

import { useSelector } from "react-redux";

const Map = ({ userInfo }) => {

    // console.log(userInfo);
    // console.log(logInfo);

    const logInfo = useSelector((state) => {
        if (state.logbook.logbook !== [] && state.logbook.selectedLog !== null) {
            let logbook = state.logbook.logbook;
            let selectedLog = state.logbook.selectedLog;
            return logbook.find((log) => log._id === selectedLog);
        } else {
            return null;
        }
    });

    // console.log("selectedLog: ", logInfo);

    const [page, setPage] = useState("home");
    const location = useLocation();

    const [friends, setFriends] = useState([]);

    const [currentPosition, setCurrentPosition] = useState({
        lat: 40.744838,
        lng: -74.025683,
    });

    useQuery(queries.GET_FRIENDS_LIST, {
        variables: { userId: userInfo?._id },
        fetchPolicy: "cache-and-network",
        skip: !userInfo,
        onCompleted: (data) => {
            setFriends(data.getFriendsList);
        },
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
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });

    const userIcon = useMemo(() => {
        return userInfo && userInfo.avatar
            ? {
                url: userInfo.avatar,
                scaledSize: new window.google.maps.Size(75, 75),
            }
            : null;
    }, [userInfo]);

    const friendIcons = useMemo(() => {
        return friends.map((user) => {
            let res = user.lastPosition.lat &&
                user.lastPosition.lng &&
                user.avatar
                ? {
                    id: user._id,
                    position: user.lastPosition,
                    icon: {
                        url: user.avatar,
                        scaledSize: new window.google.maps.Size(75, 75),
                    },
                }
                : null;

            // console.log("friendIcons: ", res);
            return res;
        });
    }, [friends]);

    let html = undefined;

    if (!isLoaded) {
        html = (
            <div>
                <h3>Loading map...</h3>
            </div>
        );
    } else {
        let user_avator_html = (
            <div className="user-avator">
                {userIcon && (
                    <MarkerF
                        position={userInfo.lastPosition}
                        icon={userIcon}
                        onClick={() => console.log("You clicked me!")}
                    />
                )}
                {(!userInfo || !userIcon) && (
                    <MarkerF
                        position={currentPosition}
                        onClick={() => console.log("You clicked me!")}
                    />
                )}
            </div>
        );

        let frineds_avator_html = (
            <div className="friends-avator">
                {friends !== [] &&
                    friendIcons.map((friendIcon) =>
                        friendIcon ? (
                            <MarkerF
                                key={friendIcon.id}
                                position={friendIcon.position}
                                icon={friendIcon.icon}
                                onClick={() => console.log(userInfo.username)}
                            />
                        ) : (
                            <div key={userInfo._id}></div>
                        ),
                    )}
            </div>
        );

        if (logInfo) {
            // console.log("logInfo: ", logInfo);
        }

        let log_html = (
            <div className="loginfo-map">
                {logInfo && (logInfo.route.length !== 0) && (
                    <div>
                        <PolylineF
                            path={logInfo.route}
                            options={{
                                strokeColor: "#007FFF",
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
                        mapContainerClassName="map-container"
                        zoom={15}
                        center={currentPosition}
                    >
                        {user_avator_html}

                        {(page === "home") && frineds_avator_html}
                        {(page === "runner") && log_html}
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
