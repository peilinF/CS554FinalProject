import axios from "axios";

export const fsqApiInstance = axios.create({
  baseURL: "https://api.foursquare.com/v3/places/",
  headers: {
    Accept: "application/json",
    Authorization: "fsq3PnhE5Zyd+DmfVJu+uHVFrTf/db8notB4S3S10xBz/JM=",
  },
});
