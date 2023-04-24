import express from "express";
import session from 'express-session';
import constructRoutes from "./routes/index.js";

import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use(session({
  name: 'AuthCookie',
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000
  }
}));

let urTrack = {};
app.use((req, res, next) => {
  if (!urTrack[req.method + req.originalUrl]) {
    urTrack[req.method + req.originalUrl] = 0
  }
  urTrack[req.method + req.originalUrl] += 1;
  if (!req.session.user) {
    console.log("User not Authorized")
  }
  else {
    console.log("User Authorized")
  }
  let temp = req.body
  if (!temp.password) {
    console.log(req.method + ' ' + req.originalUrl + ' ' + urTrack[req.method + req.originalUrl] + ' ' + JSON.stringify(req.body))
  }
  else {
    console.log(req.method + ' ' + req.originalUrl + ' ' + urTrack[req.method + req.originalUrl] + JSON.stringify(req.body.username))
  }
  next();
});

constructRoutes(app);

app.listen(5000, () => {
  console.log("Server started at http://localhost:5000/");
});
