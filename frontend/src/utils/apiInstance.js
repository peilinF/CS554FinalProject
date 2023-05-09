import axios from "axios";
import { getAuth } from "firebase/auth";

let production = false;

const auth = getAuth();

if (window.location.hostname === "localhost") {
  production = true;
}

export const url = production
  ? "https://backend-ouqqieppnq-uc.a.run.app/"
  : "https://backend-ouqqieppnq-uc.a.run.app/"
export const apiInstance = axios.create({
  baseURL: url,
});
