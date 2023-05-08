import express from "express";
import { createUser, getUserById } from "../data/users.js";
import { users } from "../config/mongoCollections.js";

const router = express.Router();

//Only for testing
router.get("/", async (req, res) => {
  try {
    let usersCollection = users();

    let data = await usersCollection.find({}).toArray();
    res.status(200).json(data);
  } catch (error) {
    res.json(error);
  }
});

// router.route("/login").post(async (req, res) => {
//   try {
//     console.log(req.body);
//     let usernameInput = req.body.username;
//     let passwordInput = req.body.password;
//     if (req.session.user != undefined) {
//       throw res.status(403).json({ error: "User already login" });
//     }
//     let loginIn = await loginUser(usernameInput, passwordInput, nameInput);
//     req.session.user = { id: loginIn.id, userName: usernameInput };
//     res.status(200).json({
//       id: loginIn.id.toString(),
//       name: loginIn.name,
//       userName: usernameInput,
//     });
//   } catch (e) {
//     res.status(400).json({ error: e });
//   }
// });

router.route("/register").post(async (req, res) => {
  try {
    console.log(req.body);
    let name = req.body.name;
    let email = req.body.email;
    let _id = req.body.uid;
    let result = await createUser(name, email, _id);
    console.log(result);
    res.json(result);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  res.json({ Authenticated: "logout" });
});

router.route("/:userId").get(async (req, res) => {
  try {
    const userInfo = await getUserById(req.params.userId);
    console.log(userInfo);
    res.status(200).json(userInfo);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
