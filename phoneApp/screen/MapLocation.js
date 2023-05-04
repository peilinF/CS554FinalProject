import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { getAuth } from "firebase/auth";
import axios from 'axios';
import uuid  from 'react-native-uuid';
export default function MapLocation({ navigation }) {
  const [showMap, setShowMap] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const [watchPosition, setWatchPosition] = useState(null);
  const auth = getAuth();
  const user = { "id": auth.currentUser.uid, "email": auth.currentUser.email };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    })();
  }, []);

  useEffect(() => {
    console.log(user);
    console.log('locationHistory:', locationHistory);
  }, [locationHistory]);

  const startTracking = async () => {
    let position = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 0.1,
      },
      (location) => {
        setCurrentLocation(location.coords);
        setLocationHistory((prevLocationHistory) => [...prevLocationHistory, location.coords]);

      }
    );
    setWatchPosition(position);
  };

  const stopTracking = async () => {
    if (watchPosition) {
      watchPosition.remove();
      setWatchPosition(null);

      let route = [];
      for( let location of locationHistory){
        route.push({"lat":location.latitude,"lng":location.longitude});
      }
      console.log(route);
      const log_info = {
        id:uuid.v4(),
        date : new Date().toISOString().split('T')[0],
        time : new Date().toISOString().split('T')[1].split('.')[0],
        route : route,
        notes : "This is real user route data"
      }
      const data = {
        "id": user.id,
        "log_info": log_info,
      }


      try{
        await axios.post('http://192.168.194.157:5001/maps', data)
        .catch((error) => {
          console.log(error);
        });

      } catch (e) {
        console.log(e);
      }
      

      setLocationHistory([]);
    }
  };

  const logOutButton = async () => {
    try{
      await auth.signOut();
      navigation.navigate('Login');
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
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
  },
  controlButton: {
    position: 'absolute',
    bottom: 40,
    borderRadius: 20,
    padding: 10,
  },
  startButton: {
    backgroundColor: 'green',
    left: 20,
  },
  stopButton: {
    backgroundColor: 'red',
    right: 20,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  logOutButton: {
    backgroundColor: 'blue',
    right: 20,
  },
});
