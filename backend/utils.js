import { ObjectId } from "mongodb";

// basic error checking

function checkInputExists(input) {
    if (input == undefined) {
        throw 'input does not exist';
    }
}

function checkInputType(input, type) {
    if (type === 'array') {
        if (!Array.isArray(input)) {
            throw 'provided input is not an array';
        }
    }
    else if (type === 'object') {
        if (Array.isArray(input)) {
            throw 'provided input is an array';
        }
        else if (typeof (input) !== 'object') {
            throw 'provided input is not an object';
        }
    }
    else {
        if (typeof (input) !== type) {
            throw `provided input is not a ${type}`;
        }
    }
}

function checkStringEnpty(str) {
    str = str.trim();
    if (str.length == 0) {
        throw 'provided input string is empty';
    }
}

function checkString(str) {

    checkInputExists(str);
    checkInputType(str, 'string');
    checkStringEnpty(str);

    return str.trim();

}

function checkInt(num) {

    if (num % 1 !== 0) {
        throw 'num is not integer';
    }

    return num;

}

function checkStringArray(arr, varName) {

    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings

    let arrayInvalidFlag = false;

    if (!arr || !Array.isArray(arr))
        throw `You must provide an array of ${varName}`;
    for (i in arr) {
        if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
            arrayInvalidFlag = true;
            break;
        }
        arr[i] = arr[i].trim();
    }

    if (arrayInvalidFlag)
        throw `One or more elements in ${varName} array is not a string or is an empty string`;
    return arr;

}

function checkName(name, reg = /[^a-zA-Z ]+/g) {

    name = checkString(name);

    name_standard = name.replace(reg, "");

    if (name_standard !== name) {
        throw 'name should has no numbers or special characters or punctuation'
    }

    name_lst = name.split(' ');

    if (name_lst.length !== 2) {
        throw 'name should has first name and last name, and only one space between them';
    }

    first_name = name_lst[0];
    last_name = name_lst[1];

    if (first_name.length < 3) {
        throw 'first name should be at least 3 characters';
    }

    if (last_name.length < 3) {
        throw 'last name should be at least 3 characters';
    }

    return name;

}

const checkUsername = (username) => {

    username = checkString(username);

    let reg = /[^a-zA-Z0-9]+/g;
    if (username.match(reg) !== null) {
        throw 'username should has no special characters or punctuation'
    }

    if (username.length < 3) {
        throw 'username should be at least 3 characters';
    }

    return username;

};

const checkPassword = (passwd) => {

    /*

    As a general guideline, passwords should consist of 6 to 14 characters
    including one or more characters from each of the following sets:
    - Uppercase and lowercase letters (A-Z and a-z)
    - Numeric characters (0-9)
    - special character

    */

    // haven't consider special character ralated cases

    let passwd_trim = checkString(passwd);

    if (passwd.includes(' ')) {
        throw "Password should not contain spaces.";
    }

    if (passwd.length < 6 || passwd.length > 14) {
        throw "Password length should be in the range of 6 to 14 characters.";
    }

    if (passwd.match(/[a-z]+/g) === null) {
        throw "Password needs to be at least one lowercase character.";
    }

    if (passwd.match(/[A-Z]+/g) === null) {
        throw "Password needs to be at least one uppercase character.";
    }

    if (passwd.match(/[0-9]+/g) === null) {
        throw "Password needs to be at least one number.";
    }

    if (passwd.match(/[^a-zA-Z0-9]+/g) === null) {
        throw "Password needs to be at least one special character.";
    }

    return passwd;

};

const checkId = (id, varName) => {

    if (!id) throw `You must provide a ${varName}`;
    if (typeof id !== 'string') throw `${varName} must be a string`;
    id = id.trim();
    if (id.length === 0) throw `${varName} cannot be an empty string or just spaces`;
    // if (!ObjectId.isValid(id)) throw `${varName} invalid object ID`;

    return id;

};

const checkDate = (date) => {

    date = checkString(date);

    let reg = /\d{4}-\d{2}-\d{2}/g;
    if (date.match(reg) === null) {
        throw 'date should be in the format of yyyy-mm-dd';
    }

    return date;

};

const checkTime = (time) => {

    time = checkString(time);

    let reg = /\d{2}:\d{2}:\d{2}/g;
    if (time.match(reg) === null) {
        throw 'time should be in the format of hh:mm:ss';
    }

    return time;

};

const checkNotes = (note) => {

    note = checkString(note);

    let reg = /[a-zA-Z0-9]+/g;
    if (note.match(reg) === null) {
        throw 'notes should has letters or numbers';
    }

    if (note.length < 3) {
        throw 'note should be at least 3 characters';
    }

    return note;

};

const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
}

const getDistanceInKilometers = (lat1, lon1, lat2, lon2) => {
    const earthRadius = 6371; // Earth's radius in kilometers

    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) *
        Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
}

const getDistanceInMiles = (lat1, lon1, lat2, lon2) => {
    let res = getDistanceInKilometers(lat1, lon1, lat2, lon2) * 0.621371;
    return Number(res.toFixed(2));
}

const checkRoute = (route) => {

    if (!route) throw `You must provide a route`;

    if (!Array.isArray(route)) throw `route must be an array`;

    if (route.length < 2) throw `route must have at least 2 points`;

    for (let i = 0; i < route.length; i++) {
        if (!route[i].lat) throw `route[${i}] must have a latitude`;
        if (!route[i].lng) throw `route[${i}] must have a longitude`;
        if (typeof route[i].lat !== 'number') throw `route[${i}].latitude must be a number`;
        if (typeof route[i].lng !== 'number') throw `route[${i}].longitude must be a number`;
    }

    return route;

};

const checkUnit = (unit) => {

    if (!unit) throw `You must provide a unit`;

    unit = unit.toLowerCase();

    if (unit !== 'km' && unit !== 'mi') throw `Invalid unit: ${unit}`;

    return unit;

};

const getDistance = (route, unit='mi') => {

    route = checkRoute(route);
    unit = checkUnit(unit);

    let distance = 0;
    let calcFunc = undefined;
    if (unit === 'km') {
        calcFunc = getDistanceInKilometers;
    } else if (unit === 'mi') {
        calcFunc = getDistanceInMiles;
    }

    for (let i = 0; i < route.length - 1; i++) {
        distance += calcFunc(route[i].lat, route[i].lng, route[i+1].lat, route[i+1].lng);
    }

    return Number(distance.toFixed(2));

};

const checkDistance = (distance) => {

    if (!distance) throw `You must provide a distance`;

    if (typeof distance !== 'number') throw `distance must be a number`;

    if (distance < 0) throw `distance must be greater than 0`;

    return distance;

};

const getPace = (distance, time, unit) => {

    distance = checkDistance(distance);
    time = checkTime(time);
    unit = checkUnit(unit);

    time = time.split(':');
    time = parseInt(time[0])*60 + parseInt(time[1]) + parseInt(time[2])/60;

    let pace = (time / distance).toFixed(2);

    // convert time to mm:ss
    let minutes = Math.floor(pace);
    let seconds = Math.round((pace - minutes) * 60);
    if (seconds < 10) seconds = '0' + seconds;

    let pace_str = minutes + ':' + seconds + ' min/' + unit;

    return pace_str;

};

export default {
    checkName,
    checkUsername,
    checkPassword,
    checkId,
    checkNotes,
    checkDate,
    checkTime,
    checkRoute,
    getDistance,
    getPace,
};