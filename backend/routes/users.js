const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.user;
const utils = require('../utils');
const xss = require('xss');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

router
  .route('/signup')
  .post(async (req, res) => {
    let name = undefined;
    let username = undefined;
    let password = undefined;
    let avatarUrl = undefined;

    // error check

    try {
      name = utils.checkName(xss(req.body.name));
      username = utils.checkUsername(xss(req.body.username));
      password = utils.checkPassword(xss(req.body.password));
      avatarUrl = req.body.avatar ? xss(req.body.avatar) : "";
    } catch (e) {
      res.status(400).json({ error: e });
      return;
    }

    try {
      // check if username already in database

      let username_in_use = await userData.getUserByUsername(username);
      if (username_in_use) {
        res.status(409).json({ error: 'Username already in use' });
        return;
      }

      // create user

      let user_info = {
        name: name,
        username: username,
        password: password,
        avatar: avatarUrl,
      };

      const create_user = await userData.createUser(user_info);

      if (!create_user) {
        res.status(400).json({ error: 'User creation failed' });
      } else {
        res.status(200).json(create_user);
      }
    } catch (e) {
      res.status(400).json({ error: e });
      return;
    }
  });

router
  .route('/login')
  .post(async (req, res) => {
    let username = undefined;
    let password = undefined;

    // error check

    try {
      username = utils.checkUsername(xss(req.body.username));
      password = utils.checkPassword(xss(req.body.password));
    } catch (e) {
      res.status(400).json({ error: e });
      return;
    }

    try {
      // check if username already in database
      let user = await userData.getUserByUsername(username);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Verify the password
      const isPasswordMatch = await userData.checkUser({username, password});

      if (isPasswordMatch) {
        // Generate JWT
        const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            token,
            userInfo: user
        });
      } else {
        res.status(400).json({ error: 'Incorrect password' });
      }
    } catch (e) {
      res.status(500).json({ error: e });
      return;
    }
  });

router
  .route('/user-info')
  .get(async (req, res) => {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    // Extract the token from the header
    const token = authHeader.split(' ')[1];
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user information
      const user = await userData.getUserById(decoded.userId);

      if (user) {
        // Remove the password from the user object
        const { password, ...userInfo } = user;
        res.status(200).json(userInfo);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  });

router
  .route('/logout')
  .get(async (req, res) => {
    try {
      req.session.destroy();
      return res.status(200).json({ message: 'User logged out' });
    } catch (e) {
      res.status(500).json({ error: e });
      return;
    }
  });

router
  .route('/addfriend/:userId/:searchTerm')
  .get(async (req, res) => {
    
    let userId = req.params.userId;
    let searchTerm = req.params.searchTerm;

    // error check

    try {
      userId = utils.checkId(userId, "userId");
      searchTerm = utils.checkId(searchTerm, "searchTerm");
    } catch (e) {
      res.status(400).json({ error: e });
      return;
    }

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

module.exports = router;

