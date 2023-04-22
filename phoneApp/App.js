import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

const App = () => {
  const [showMap, setShowMap] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [locationHistory, setLocationHistory] = useState([]);

  useEffect(() => {
    const getLocationAsync = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    };

    getLocationAsync();
  }, []);

  const toggleMapView = () => {
    setShowMap(!showMap);
  };

  const startTracking = () => {
    setTracking(true);
  };

  const stopTracking = () => {
    setTracking(false);
    const newHistory = [...locationHistory, currentLocation];
    setLocationHistory(newHistory);
    console.log(newHistory);
  };

  return (
    <View style={styles.container}>
      {showMap ? (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: currentLocation?.latitude || 37.78825,
              longitude: currentLocation?.longitude || -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            followsUserLocation={tracking}
            onUserLocationChange={(event) => {
              if (tracking) {
                setCurrentLocation(event.nativeEvent.coordinate);
              }
            }}
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
            <Text style={styles.closeButtonText}>Close Map</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, styles.startButton]}
            onPress={startTracking}
            disabled={tracking}
          >
            <Text style={styles.controlButtonText}>Start record</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, styles.stopButton]}
            onPress={stopTracking}
            disabled={!tracking}
          >
            <Text style={styles.controlButtonText}>Stop</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Button title="Map" onPress={toggleMapView} />
      )}
    </View>
  );
};

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
    bottom: 30,
    zIndex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    elevation: 2,
  },
  startButton: {
    left: 30,
    backgroundColor: '#00a3cc',
  },
  stopButton: {
    right: 30,
    backgroundColor: '#ff3300',
  },
  controlButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default App;