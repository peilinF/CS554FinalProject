import axios from "axios";

export const mapApiInstance = axios.create({
  baseURL: "https://api.mapbox.com/directions/v5/mapbox/walking",
  params: {
    access_token:
      "pk.eyJ1IjoieWFzaC1yIiwiYSI6ImNsZ3NsMng3bTF1N3UzZXAzNGx2cjF1dGMifQ.jqnN_Nf8g18WlZ_iKJjcrQ",
  },
});
