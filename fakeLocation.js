function generateLocationHistory(startLatitude, startLongitude, speedKmH, totalDistanceKm, intervalSeconds = 10) {
    const R = 6371; // Earth's radius in km
    const toRadians = (angle) => (angle * Math.PI) / 180;
    const toDegrees = (angle) => (angle * 180) / Math.PI;
  
    const totalSeconds = (totalDistanceKm / speedKmH) * 3600; // Total time in seconds
    const numIntervals = Math.floor(totalSeconds / intervalSeconds);
  
    const locationHistory = [{ latitude: startLatitude, longitude: startLongitude }];
  
    for (let i = 1; i <= numIntervals; i++) {
      const currentLatitude = locationHistory[i - 1].latitude;
      const currentLongitude = locationHistory[i - 1].longitude;
      const randomBearing = Math.random() * 2 * Math.PI; // Random direction in radians
  
      const distanceIntervalKm = (speedKmH * intervalSeconds) / 3600; // Distance traveled in each interval
      const angularDistance = distanceIntervalKm / R; // Angular distance in each interval
  
      const newLatitude = Math.asin(
        Math.sin(toRadians(currentLatitude)) * Math.cos(angularDistance) +
          Math.cos(toRadians(currentLatitude)) * Math.sin(angularDistance) * Math.cos(randomBearing)
      );
  
      const newLongitude =
        toRadians(currentLongitude) +
        Math.atan2(
          Math.sin(randomBearing) * Math.sin(angularDistance) * Math.cos(toRadians(currentLatitude)),
          Math.cos(angularDistance) - Math.sin(toRadians(currentLatitude)) * Math.sin(newLatitude)
        );
  
      locationHistory.push({ latitude: toDegrees(newLatitude), longitude: toDegrees(newLongitude) });
    }
  
    return locationHistory;
  }
  
  const startLatitude = 37.78825;
  const startLongitude = -122.4324;
  const speedKmH = 10; // 10 km/h
  const totalDistanceKm = 5; // 1 km
  
  const locationHistory = generateLocationHistory(startLatitude, startLongitude, speedKmH, totalDistanceKm);
  console.log(locationHistory);
  