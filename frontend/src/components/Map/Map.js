import "./map.css";

import axios from "axios";
import { apiInstance } from "../../utils/apiInstance";

import React, { useState, useEffect, useRef } from "react";

import { getAuth } from "firebase/auth";

import Directions from "./Directions";
import { GoogleMap, useLoadScript, MarkerF, Autocomplete, DirectionsRenderer } from "@react-google-maps/api";

import REACT_APP_GOOGLE_MAPS_API_KEY from "./api_key";
const libraries = ["places"];

const Map = () => {

    const auth = getAuth();

    const [directions, setDirections] = useState(null);
    const [totalDistance, setTotalDistance] = useState(0);

    const handleTotleDistance = (distance) => {
        setTotalDistance(distance);

        if (distance === 0) {
            setDirections(null);
            setGenerater(false);
        }
    };

    const [distance, setDistance] = useState(0);
    const [generater, setGenerater] = useState(false);

    const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });
    const autocompleteRef = useRef(null);

    const [showRoute, setShowRoute] = useState(false);
    const [savedRoutes, setSavedRoutes] = useState(null);
    const [routeIndex, setRouteIndex] = useState(0);

    const [showLog, setShowLog] = useState(false);
    const [logbook, setLogbook] = useState(null);
    const [selectedLog, setSelectedLog] = useState(null);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [notes, setNotes] = useState("");

    const [createStatus, setCreateStatus] = useState(false);

    const [editStatus, setEditStatus] = useState(false);
    const [editTitle, setEditTitle] = useState("");

    const getSavedRoutes = async () => {
        try {
            console.log(auth.currentUser.uid);
            const res = await apiInstance.get("/logbook/get-all-routes", {
                params: {
                    userId: auth.currentUser.uid,
                },
            });

            return res.data.routes;
        } catch (error) {
            console.log(error);
            console.log("Error getting all routes");
        }
    };

    useEffect(() => {
        getSavedRoutes().then((routes) => {
            setSavedRoutes(routes);
        });
    }, []);

    const getLogbook = async () => {
        try {
            const res = await apiInstance.get("/logbook/get-logbook", {
                params: {
                    userId: auth.currentUser.uid,
                },
            });

            return res.data.logbook;
        } catch (error) {
            console.log(error);
            console.log("Error getting logbook");
        }
    };

    useEffect(() => {
        getLogbook().then((logbook) => {
            setLogbook(logbook);
        });
    }, []);

    // Google Maps API
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const onPlaceSelected = () => {

        setDistance(0);
        setGenerater(false);
        setShowRoute(false);
        setShowLog(false);

        document.querySelector("#distance").value = "";

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
        setShowRoute(false);
        setShowLog(false);

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
        setShowRoute(false);
        setShowLog(false);
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

        let latLngs = readDirections(directions);
        setDirections({
            route: latLngs,
            ori_directions: directions,
        });
    };

    const saveDirectionsToLogbook = async () => {

        try {
            const res = await apiInstance
                .post("/logbook/save-route", {
                    userId: auth.currentUser.uid,
                    directions: directions,
                });
            console.log(res.data);
        } catch (error) {
            console.log("Error saving directions to logbook");
        }

        getSavedRoutes().then((routes) => {
            setSavedRoutes(routes);
            console.log(savedRoutes);
        });

    };

    const deleteRouteFromLogbook = async (routeId) => {

        setDistance(0);
        setGenerater(false);
        setShowRoute(false);
        setShowLog(false);

        try {
            const res = await apiInstance
                .get("/logbook/delete-route", {
                    params: {
                        userId: auth.currentUser.uid,
                        routeId: routeId,
                    },
                });
        } catch (error) {
            console.log("Error deleting route from logbook");
        }

        getSavedRoutes().then((routes) => {
            setSavedRoutes(routes);
        });

        console.log(showRoute);

    };

    const openCreateForm = async () => {

        setEditStatus(false);
        setCreateStatus(true);

    };

    const createLog = async () => {

        console.log("create log");

        setCreateStatus(false);
        setEditStatus(false);

        if (!checkTime(time)) {
            alert("Invalid time format");
            document.querySelector("#time").value = "";
            return;
        }

        console.log(directions);

        try {
            const res = await apiInstance
                .get("/logbook/create-log", {
                    params: {
                        userId: auth.currentUser.uid,
                        log_info: {
                            date: date,
                            time: time,
                            notes: notes,
                            routeId: directions._id,
                        }
                    },
                });

            // console.log(res.data);
        } catch (error) {
            console.log("Error creating log");
        }

        getLogbook().then((logbook) => {
            setLogbook(logbook);
        });

    };

    const editLog = async () => {

        console.log("edit log");

        setCreateStatus(false);
        setEditStatus(false);

        if (!selectedLog) {
            alert("Please select a log to edit");
            return;
        }

        if (!checkTime(time)) {
            alert("Invalid time format");
            document.querySelector("#time").value = "";
            return;
        }

        let routeId = null;
        if (directions) {
            routeId = directions._id;
        } else if (selectedLog.routeInfo) {
            routeId = selectedLog.routeInfo._id;
        }

        try {
            const res = await apiInstance
                .get("/logbook/edit-log", {
                    params: {
                        userId: auth.currentUser.uid,
                        logId: selectedLog._id,
                        log_info: {
                            date: date,
                            time: time,
                            notes: notes,
                            routeId: routeId,
                        }
                    },
                });

            // console.log(res.data);
        } catch (error) {
            console.log("Error editing log");
        }

        getLogbook().then((logbook) => {
            setLogbook(logbook);
        });

        setShowLog(false);
        setSelectedLog(null);

    };

    const deleteLogFromLogbook = async () => {

        console.log("delete log");

        setCreateStatus(false);
        setEditStatus(false);

        if (!selectedLog) {
            alert("Please select a log to delete");
            return;
        }

        try {
            const res = await apiInstance
                .get("/logbook/delete-log", {
                    params: {
                        userId: auth.currentUser.uid,
                        logId: selectedLog._id,
                    },
                });

            // console.log(res.data);
        } catch (error) {
            console.log("Error deleting log");
        }

        getLogbook().then((logbook) => {
            setLogbook(logbook);
        });

        setShowLog(false);
        setSelectedLog(null);

    };

    const checkTime = (time) => {

        if (!time) throw 'You must provide a time';

        let reg = /\d{2}:\d{2}:\d{2}/g;
        if (time.match(reg) === null) {
            return false;
        }

        time = time.split(':');
        if (parseInt(time[0]) > 23 || parseInt(time[1]) > 59 || parseInt(time[2]) > 59) {
            return false;
        }

        return true;

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
            {showRoute && (
                <DirectionsRenderer directions={savedRoutes[routeIndex].ori_directions} />
            )}
            {showLog && (
                <DirectionsRenderer directions={selectedLog.routeInfo.ori_directions} />
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

    let savedRoutes_html = (
        <div>
            <h3>Saved routes: </h3>
            <ul className='saved-routes-ul'>
                {savedRoutes && savedRoutes.map((route, index) => (
                    <div key={index}>
                        <li
                            className='saved-routes-li'
                            key={index}
                        >
                            <p
                                onClick={() => {
                                    setRouteIndex(index);
                                    setShowRoute(true);
                                    setGenerater(false);
                                    setDirections(route);
                                    setShowLog(false);
                                }}
                            >Route {index + 1}</p>
                            <button onClick={() => {
                                deleteRouteFromLogbook(route._id);
                            }}>x</button>
                        </li>

                    </div>
                ))}
            </ul>

            {showRoute && (
                <div>
                    <p> Want to create a new log? </p>
                    <button
                        onClick={() => openCreateForm()}
                    >Create</button>
                </div>
            )}
        </div>
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
                                setShowRoute(false);
                                setDistance(parseFloat(e.target.value))
                            }}
                        />
                    </label>
                </div>


                {!generater && (<button
                    onClick={() => generatePath()}
                >
                    Generate
                </button>)}
                {generater && (<button
                    onClick={() => {
                        setGenerater(false);
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

                {savedRoutes_html}
            </div>
        </div>
    );

    let logbook_list_html = (
        <div>
            <h2>Logbook</h2>
            <ul className='logbook-ul'>
                {logbook && logbook.map((log) => {
                    console.log(log);
                    return (
                        <li
                            key={log._id}
                            className='logbook-li'
                            onClick={() => {
                                setSelectedLog(log);
                                setEditStatus(false);
                                setShowRoute(false);
                                setGenerater(false);
                                setShowLog(true);
                            }}
                        >
                            <p>{log.date}</p>
                            <p>{log.time}</p>
                            <p>{log.distance.toFixed(2)}</p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );

    let createLog_html = (
        <div>
            <h2>Create</h2>

            <div className='logbook-edit-form'>
                <label>
                    Date:
                    <input
                        id="date"
                        type="date"
                        placeholder="Date"
                        onChange={(e) => {
                            setDate(e.target.value);
                        }}
                        required
                    />
                </label>
                <label>
                    Time:
                    <input
                        id="time"
                        type="text"
                        placeholder="Time"
                        onChange={(e) => {
                            setTime(e.target.value);
                        }}
                        required
                    />
                </label>
                <label>
                    Notes:
                    <textarea
                        id="notes"
                        placeholder="Notes"
                        onChange={(e) => {
                            setNotes(e.target.value);
                        }}
                    />
                </label>

                <br />

                <button
                    onClick={() => createLog()}
                >
                    Submit
                </button>

            </div>
        </div>
    );

    let editLog_html = (
        <div>
            {!selectedLog && (
                <div>
                    <p>Click a log to edit.</p>
                </div>
            )}
            {selectedLog && (
                <div>
                    <h2>Edit</h2>

                    <div className='logbook-edit-form'>
                        <label>
                            Date:
                            <input
                                id="date"
                                type="date"
                                placeholder="Date"
                                value={date}
                                onChange={(e) => {
                                    setDate(e.target.value);
                                }}
                            />
                        </label>
                        <label>
                            Time:
                            <input
                                id="time"
                                type="text"
                                placeholder="Time"
                                value={time}
                                onChange={(e) => {
                                    setTime(e.target.value);
                                }}
                            />
                        </label>
                        <label>
                            Notes:
                            <textarea
                                id="notes"
                                placeholder="Notes"
                                value={notes}
                                onChange={(e) => {
                                    setNotes(e.target.value);
                                }}
                            />
                        </label>

                        <br />

                        <button
                            onClick={() => editLog()}
                        >
                            Submit
                        </button>

                        <button
                            className='delete-btn'
                            onClick={() => {
                                deleteLogFromLogbook(selectedLog._id);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    let logInfo_html = (
        <div>
            {selectedLog && (
                <div>
                    {selectedLog && (
                        <div>
                            <h3>{selectedLog.Date}</h3>
                            <br />
                            <h3>Time: </h3>
                            <p>{selectedLog.time}</p>
                            <h3>Distance: </h3>
                            <p>{selectedLog.distance} mi</p>
                            <h3>Pace: </h3>
                            <p>{selectedLog.pace}</p>
                            <h3>Notes: </h3>
                            <p>{selectedLog.notes}</p>
                        </div>

                    )}

                    <button
                        className='edit-btn'
                        onClick={() => {
                            setEditStatus(true);
                            setCreateStatus(false);
                            setShowRoute(false);
                            setShowLog(true);
                            setDate(selectedLog.date);
                            setTime(selectedLog.time);
                            setNotes(selectedLog.notes);
                        }}
                    >
                        Edit
                    </button>

                </div>
            )}
            {!selectedLog && (
                <div>
                    <p>Click a log to check info.</p>
                </div>
            )}
        </div>
    );

    let logbook_html = (
        <div>
            {logbook_list_html}
            {editStatus && selectedLog && editLog_html}
            {createStatus && directions && createLog_html}
            {(!editStatus && !createStatus) && logInfo_html}
        </div>
    );

    let html = (
        <div className="map-page">
            <div className="map-container">{map_html}</div>
            <div className="input-container">{input_html}</div>
            <div className="logbook-container">{logbook_html}</div>
        </div>
    );

    return html;
};

export default Map;

