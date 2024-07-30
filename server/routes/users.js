const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const { Users } = require("../models");
const {sign} = require('jsonwebtoken')
const {validateToken} = require('../middlewares/AuthMiddleware')
require('dotenv').config();

router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    await Users.create({
      username: username,
      password: hashedPassword,
      role: role,
    });
    res.status(201).json("Registered Successfully, please log in.");
  } catch (error) {
    // Handle Sequelize unique constraint error, username already exists in database
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: 'Username already exists, please use another.' });
    } else {
      // Handle other errors
      res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
    }
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ where: { username: username } });
    if (user) {
      // if user is found in database
      const match = await bcryptjs.compare(password, user.password);
      if (match) {
        const accessToken = sign({ username: user.username, id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '30d' });
        res.status(200).json({ message: 'Login Success!', token: accessToken, username: user.username, id: user.id, role: user.role });
      } else {
        // if passwords do not match
        res.status(401).json({ message: 'Invalid password' });
      }
    } else {
      // if user is not found in database
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    // handle other errors
    res.status(500).json({ message: error.message || "An unexpected error occurred. Please try again later." });
  }
});

router.get('/authenticate', validateToken, (req, res) => {
  res.json(req.user);
});

module.exports = router;