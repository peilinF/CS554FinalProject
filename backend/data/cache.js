const redis = require('redis');
const client = redis.createClient();

const utils = require("../utils");

client.connect().then(() => {});

const getDataFromCache = async (key) => {

    // check if key exists in redis
    let exists = await client.exists(key);

    // if key exists in redis, get data from redis
    if (exists) {
        let data_redis = await client.get(key);

        console.log("get data from redis");
        return JSON.parse(data_redis);
    } else {
        return null;
    }

}

const setDataToCache = async (key, data) => {

    // set data to redis

    await client.set(key, JSON.stringify(data));
    console.log("set data to redis");

}

const updateViewCount = async (key) => {

    // update view count in redis

    await client.zIncrBy("viewCount", 1, key);

}

const getTopViewed = async (num) => {

    console.log(num)

    // check if num is valid
    num = utils.checkInt(num, "Top Viewed Number");

    // get the number of recipes
    let recipeNum = await client.zCard("viewCount");

    // if there is no recipe, return empty array
    if (recipeNum === 0) return [];

    // if num is larger than the number of recipes, set num to the number of recipes
    if (num > recipeNum) num = recipeNum;

    let topViewed = await client.zRange("viewCount", 0, num - 1, {REV: true});

    return topViewed;

}

const checkExists = async (key) => {

    // check if key exists in redis
    let exists = await client.exists(key);

    return exists;

}

const updateCache = async (key, data) => {

    // update data in redis
    await client.set(key, JSON.stringify(data));

}

const closeConnection = async () => {

    // close connection
    await client.quit();

}

const clearCache = async () => {

    // clear cache
    await client.FLUSHALL();

}

module.exports = {
    getDataFromCache,
    setDataToCache,
    updateViewCount,
    getTopViewed,
    checkExists,
    updateCache,
    closeConnection,
    clearCache
}