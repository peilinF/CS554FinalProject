import axios from "axios";

let production = false;

if (window.location.hostname == "localhost") {
  production = true;
}

export const apiInstance = axios.create({
  baseURL: production ? "http://localhost:5000/" : process.env.SERVER_URI,
});
