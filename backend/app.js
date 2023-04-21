import express from "express";
import session from 'express-session';
import constructRoutes from "./routes/index.js";

import cors from "cors";

const app = express();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000
  }
}));

app.get('/check', (req, res) => {
  res.json({ "Hello": [1, 2, 3, 4, 5] });
});

app.get('/get-session', (req, res) => {
  const username = req.session.username;
  res.send(`Username: ${username}`);
});

app.use(cors());
app.use(express.json());

constructRoutes(app);

app.listen(5000, () => {
  console.log("Server started at http://localhost:5000/");
});
