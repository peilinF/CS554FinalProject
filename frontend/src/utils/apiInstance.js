import axios from "axios";

let production = false;

if (window.location.hostname === "localhost") {
  production = true;
}

export const socketio_url = production ? "http://localhost:4000/" : process.env.SOCKETIO_URI;
export const url = production ? "http://localhost:5000/" : process.env.SERVER_URI;
export const apiInstance = axios.create({ baseURL: url });
