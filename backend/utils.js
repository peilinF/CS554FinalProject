const {ObjectId} = require('mongodb');

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
        else if (typeof(input) !== 'object') {
            throw 'provided input is not an object';
        }
    }
    else {
        if (typeof(input) !== type) {
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

function checkName(name, reg=/[^a-zA-Z ]+/g) {

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
    if (!ObjectId.isValid(id)) throw `${varName} invalid object ID`;

    return id;

};

const checkTitle = (title) => {

    title = checkString(title);

    if (title.length < 3) {
        throw 'title should be at least 3 characters';
    }

    // check if title make sense

    let reg = /[^a-zA-Z0-9 ]+/g;
    if (title.match(reg) !== null) {
        throw 'title should has no special characters or punctuation'
    }

    return title;

};

const checkIngredients = (ingredients) => {

    ingredients = checkStringArray(ingredients, 'ingredients');

    if (ingredients.length < 3) {
        throw 'ingredients should have at least 3 ingredients';
    }

    reg = /[^a-zA-Z0-9 ]+/g;
    for (let ele of ingredients) {

        ele = checkString(ele);

        if (ele.match(reg) !== null) {
            throw 'each ingredient should has no special characters or punctuation'
        }

        if (ele.length < 3) {
            throw 'each ingredient should be at least 3 characters';
        }
    }

    return ingredients;
};

const checkSteps = (steps) => {

    steps = checkStringArray(steps, 'steps');

    if (steps.length < 5) {
        throw 'steps should have at least 5 steps';
    }

    reg = /[^a-zA-Z0-9 ,.]+/g;
    punctuation_reg = /[^ ,.]+/g;
    for (let ele of steps) {

        ele = checkString(ele);

        if (ele.match(reg) !== null) {
            throw 'each step should has no special characters'
        }

        // check if step has only punctuation
        if (ele.match(punctuation_reg) === null) {
            throw 'each step should has at least one letter or number';
        }

        if (ele.length < 20) {
            throw 'each step should be at least 20 characters';
        }
    }

    return steps;
};

const checkCookingSkillRequired = (cookingSkillRequired) => {

    let skills = ['Novice', 'Intermediate', 'Advanced'];

    if (!skills.includes(cookingSkillRequired)) {
        throw 'cooking skill required should be one of Novice, Intermediate, Advanced';
    }

    return cookingSkillRequired;

};

const checkComment = (comment) => {

    comment = checkString(comment);

    reg = /[a-zA-Z0-9]+/g;
    if (comment.match(reg) === null) {
        throw 'comment should has letters or numbers';
    }

    if (comment.length < 3) {
        throw 'comment should be at least 3 characters';
    }

    return comment;

};

const checkPage = (page) => {

    page = checkInt(page);
    if (page < 1) {
        throw 'page should be at least 1';
    }

    return page;

};

module.exports = {
    checkName,
    checkUsername,
    checkPassword,
    checkId,
    checkTitle,
    checkIngredients,
    checkSteps,
    checkCookingSkillRequired,
    checkComment,
    checkPage
};