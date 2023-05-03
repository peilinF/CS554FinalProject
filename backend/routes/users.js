import express from "express";
import userData from "../data/users.js";

import dotenv from "dotenv";
import { v4 as uuid } from "uuid";

import utils from "../utils.js";

dotenv.config();



const router = express.Router();

router
    .route('/user-info')
    .get(async (req, res) => {
        // Get the token from the Authorization header

        let userId = req.user.user_id;

        try {
            const userInfo = await userData.getUserById(userId);

            if (userInfo) {
                res.status(200).json(userInfo);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
        }
    });

// router
//     .route('/user-info')
//     .get(async (req, res) => {
//         // Get the token from the Authorization header

//         let userId = req.query.userId;

//         try {
//             const userInfo = await userData.getUserById(userId);

//             if (userInfo) {
//                 res.status(200).json(userInfo);
//             } else {
//                 res.status(404).json({ error: 'User not found' });
//             }
//         } catch (error) {
//             res.status(401).json({ error: 'Invalid token' });
//         }
//     });


router
    .route('/addfriend/:userId/:searchTerm')
    .get(async (req, res) => {

        console.log("add friend route");

        let userId = req.params.userId;
        let searchTerm = req.params.searchTerm;

        // error check

        console.log(userId, searchTerm);

        try {
            userId = utils.checkId(userId, "userId");
            searchTerm = utils.checkId(searchTerm, "searchTerm");

            console.log(userId, searchTerm);
        } catch (e) {
            console.log(e);
            res.status(400).json({ error: e });
            return;
        }

        console.log("finished error check");

        // search for users

        let user_db = undefined;
        let friend_db = undefined;

        try {
            user_db = await userData.getUserById(userId);
            friend_db = await userData.getUserById(searchTerm);
        } catch (e) {
            res.status(400).json({ error: e });
            return;
        }

        // add friend to list

        try {
            user_db = await userData.addFriend(userId, searchTerm);
        } catch (e) {
            res.status(400).json({ error: e });
            return;
        }

        // return user status

        try {
            user_db = await userData.getUserById(userId);
            return res.status(200).json(user_db);
        } catch (e) {
            res.status(400).json({ error: e });
            return;
        }

    });

router
    .route('/removefriend/:userId/:friendId')
    .get(async (req, res) => {

        let userId = req.params.userId;
        let friendId = req.params.friendId;

        // error check

        try {
            userId = utils.checkId(userId, "userId");
            friendId = utils.checkId(friendId, "friendId");
        } catch (e) {
            res.status(400).json({ error: e });
            return;
        }

        // search for users

        let user_db = undefined;
        let friend_db = undefined;

        try {
            user_db = await userData.getUserById(userId);
            friend_db = await userData.getUserById(friendId);
        } catch (e) {
            res.status(400).json({ error: e });
            return;
        }

        // remove friend from list

        try {
            user_db = await userData.removeFriend(userId, friendId);
        } catch (e) {
            res.status(400).json({ error: e });
            return;
        }

        // return user status

        try {
            user_db = await userData.getUserById(userId);
            return res.status(200).json(user_db);
        } catch (e) {
            res.status(400).json({ error: e });
            return;
        }

    });

// router
//     .route('/login')
//     .get(async (req, res) => {

//         let user_info = req.user;
//         let user_db = undefined;

//         try {
//             user_db = await userData.getUserById(user_info.user_id);
//             if (!user_db) {
//                 return res.status(400).json({ error: "User not found" });
//             }
//         } catch (e) {
//             return res.status(400).json({ error: e });
//         }

//         try {
//             req.session.id = uuid();
//             req.session.user = {id: user_db._id, name: user_db.name};
//             return res.status(200).json(user_db);
//         } catch (e) {
//             return res.status(400).json({ error: e });
//         }

//     });

router.route("/register").post(async (req, res) => {
    console.log(req.body);

    try {
        console.log(req.body.avatarUrl);
        let name = req.body.name;
        let email = req.body.email;
        let _id = req.body.uid;
        let avatarUrl = req.body.avatarUrl;
        let result = await userData.createUser({ name, email, _id, avatarUrl });

        console.log(result);

        res.status(200).json({ message: "User created" });
    } catch (e) {
        console.log("error message", e);
        res.status(400).json(e);
    }
});

router.route("/logout").get(async (req, res) => {
    req.session.destroy();
    res.json({ Authenticated: "logout" });
});

router.route("/:userId").get(async (req, res) => {
    try {
        const userInfo = await userData.getUserById(req.params.userId)
        res.status(200).json(userInfo);
    } catch (err) {
        res.status(500).json(err);
    }
})



export default router;
