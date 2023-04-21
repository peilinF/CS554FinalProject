import express from "express";
import { loginUser, createUser } from "../data/users.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ route: "/users" });
});


router
  .route('/login')
  .post(async (req, res) => {
    let usernameInput = req.body.username
    let passwordInput = req.body.password
    if (req.session.user != undefined) {
      return res.status(403).json({ error: "User already login" })
    }
    let loginIn;
    // try {
    loginIn = await loginUser(usernameInput, passwordInput);
    req.session.user = { id: loginIn.id, userName: usernameInput };
    res.status(200).json({ _id: loginIn.id.toString(), "name": loginIn.name, userName: usernameInput });
    // } catch (e) {
    //   res.status(400).json({ error: e });
    //   return;
    // }
  });

router
  .route('/signup')
  .post(async (req, res) => {
    console.log(req.body)
    let name = req.body.name;
    let usernameInput = req.body.username;
    let passwordInput = req.body.password;
    let loginIn
    try {
      loginIn = await createUser(name, usernameInput, passwordInput);
      console.log("passed")
      res.json({ name: name, userName: usernameInput });
    } catch (e) {
      res.status(400).json({ error: e });
      return;
    }
  });

router
  .route('/logout')
  .get(async (req, res) => {
    req.session.destroy();
    res.json({ Authenticated: 'logout' })
  })

export default router;
