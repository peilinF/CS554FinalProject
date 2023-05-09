import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button, TouchableOpacity, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { getAuth } from "firebase/auth";
import axios from "axios";
import uuid from "react-native-uuid";
export default function MapLocation({ navigation }) {
  const [showMap, setShowMap] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const [watchPosition, setWatchPosition] = useState(null);
  const auth = getAuth();
  const user = { id: auth.currentUser.uid, email: auth.currentUser.email };
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timer, setTimer] = useState(null);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    })();
  }, []);

  useEffect(() => {
    console.log(user);
    console.log("locationHistory:", locationHistory);
  }, [locationHistory]);

  const startTracking = async () => {
    setElapsedTime(0);
    setTimer(Date.now());
    let position = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 0.1,
      },
      (location) => {
        setCurrentLocation(location.coords);
        setLocationHistory((prevLocationHistory) => [
          ...prevLocationHistory,
          location.coords,
        ]);
      }
    );
    setWatchPosition(position);
  };


  useEffect(() => {
    if (timer) {
      const interval = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  function formatTime(second){
    const hh = Math.floor(second / 3600);
    const mm = Math.floor((second % 3600) / 60);
    const ss = second % 60;
    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
  }

  const stopTracking = async () => {
    setTimer(null);
    if (watchPosition) {
      watchPosition.remove();
      setWatchPosition(null);

      let route = [];
      for (let location of locationHistory) {
        route.push({ lat: location.latitude, lng: location.longitude });
      }
      let path_id = uuid.v4();
      let path = null;
      try{
        const data = {
          userId: user.id,
          directions:{
            route:route,
            ori_directions:null,

          } ,
        };
        await axios.post("https://backend-ouqqieppnq-uc.a.run.app/logbook/save-route", data)
        .then(async (res) => {
          const route  = res.data.route;
          const data = {
            userId: user.id,
            log_info:{
              date: new Date().toISOString().split("T")[0],
              time: formatTime(elapsedTime),
              routeInfo: route,
              notes: "real user path data",
            }
          }
          await axios.post("https://backend-ouqqieppnq-uc.a.run.app/logbook/create-log", data)
          .catch((err) => {
            console.log(err);
          }
          );
        })
        
      } catch(e){
        console.log(e);
      }

      const log_info = {

        date: new Date().toISOString().split("T")[0],
        time:elapsedTime,
        routeInfo: path,
        notes: "real user path data",

      };


      setLocationHistory([]);
    }
  };

  const logOutButton = async () => {
    try {
      await auth.signOut();
      navigation.navigate("Login");
    } catch (e) {
      console.log(e);
    }
  };

  const toggleMapView = () => {
    setShowMap(!showMap);
  };

  return (
    <View style={styles.container}>
      {showMap ? (
        <>
          <MapView
            style={styles.map}
            region={{
              latitude: currentLocation?.latitude || 37.78825,
              longitude: currentLocation?.longitude || -122.4324,
              latitudeDelta: 0.0005,
              longitudeDelta: 0.005,
            }}
            showsUserLocation={true}
            followsUserLocation={true}
          >
            {locationHistory.length > 0 && (
              <Polyline
                coordinates={locationHistory.map((location) => ({
                  latitude: location.latitude,
                  longitude: location.longitude,
                }))}
                strokeColor="#000"
                strokeWidth={3}
              />
            )}
          </MapView>
          <Text style={styles.timerText}>{`Elapsed Time: ${formatTime(elapsedTime)}`}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={toggleMapView}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          {!watchPosition && (
            <TouchableOpacity
              style={[styles.controlButton, styles.startButton]}
              onPress={startTracking}
            >
              <Text style={styles.controlButtonText}>Start</Text>
            </TouchableOpacity>
          )}
          {!watchPosition && (
            <TouchableOpacity
              style={[styles.controlButton, styles.logOutButton]}
              onPress={logOutButton}
            >
              <Text style={styles.controlButtonText}>LogOut</Text>
            </TouchableOpacity>
          )}

          {watchPosition && (
            <TouchableOpacity
              style={[styles.controlButton, styles.stopButton]}
              onPress={stopTracking}
            >
              <Text style={styles.controlButtonText}>Stop</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <Button title="Show Map" onPress={toggleMapView} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
  },
  controlButton: {
    position: "absolute",
    bottom: 40,
    borderRadius: 20,
    padding: 10,
  },
  startButton: {
    backgroundColor: "green",
    left: 20,
  },
  stopButton: {
    backgroundColor: "red",
    right: 20,
  },
  controlButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  logOutButton: {
    backgroundColor: "blue",
    right: 20,
  },
  timerText: {
    position: 'absolute',
    top: 60,
    left: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
});
