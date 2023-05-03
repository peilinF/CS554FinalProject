const randomCoordinatesAround = (center = { lat: 40.744838, lng: -74.025683 }, radius = 0.5) => {
    const randomAngle = Math.random() * 2 * Math.PI;
    const randomRadius = Math.sqrt(Math.random()) * radius;

    const newLat = center.lat + (randomRadius * Math.cos(randomAngle) / 111.32);
    const newLng = center.lng + (randomRadius * Math.sin(randomAngle) / (111.32 * Math.cos((center.lat * Math.PI) / 180)));

    return { lat: newLat, lng: newLng };
}

const generateFakeRoute = (user, numberOfPoints = 20, radius = 0.5) => {
    const route = [];
    let previousPoint = user.lastPosition;

    for (let i = 0; i < numberOfPoints; i++) {
        const newPoint = randomCoordinatesAround(previousPoint, radius);
        route.push(newPoint);
        previousPoint = newPoint;
    }

    return route;
}

const generateFakeLogbook = () => {

    // log_info = { date, time, route, notes }

    // random date and time

    let date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    date.setHours(date.getHours() - Math.floor(Math.random() * 24));
    date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 60));

    let date_time = date.toISOString().split('T')[0] + ' ' + date.toISOString().split('T')[1].split('.')[0];

    date_time = date_time.split(' ');

    date = date_time[0];
    let time = date_time[1];

    let lastPosition = randomCoordinatesAround();

    let route = generateFakeRoute({ lastPosition });
    let notes = "This is a fake logbook " + Math.random();

    let log_info = { date, time, route, notes };

    return log_info;

};

// console.log(generateFakeLogbook());

export {
    randomCoordinatesAround,
    generateFakeLogbook
};