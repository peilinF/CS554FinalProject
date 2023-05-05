import CryptoJS from 'crypto-js';

const arraysAreEqual = (arr1, arr2) => {
    // Check if both arrays have the same length
    if (arr1.length !== arr2.length) {
        return false;
    }

    // Sort the arrays
    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();


    // Compare each element of the sorted arrays
    for (let i = 0; i < sortedArr1.length; i++) {
        if (sortedArr1[i] !== sortedArr2[i]) {
            return false;
        }
    }

    // If the function hasn't returned false yet, the arrays are equal
    return true;
}

const createRoomId = (users) => {

    // create hash id from users id array

    const idString = users.sort().join('');
    const hashedIdString = CryptoJS.SHA256(idString).toString();

    return hashedIdString;
    
};

export default {
    arraysAreEqual,
    createRoomId,
};