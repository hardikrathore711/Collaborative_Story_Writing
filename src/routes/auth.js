const express = require('express');
const { createUser, findUserByEmail, generateAuthToken } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/knex'); // Knex setup for DB queries

const router = express.Router();

// POST /auth/signup
router.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // Check if email or username already exists
    const existingUser = await db("users").where({ email }).orWhere({ username }).first();
    if (existingUser) {
      return res.status(400).json({ message: "Email or username already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const [user] = await db("users")
      .insert({ email, password: hashedPassword, username })
      .returning(["id", "email", "username"]);

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error signing up" });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await db("users").where({ email }).first();
    if (!user) return res.status(404).json({ message: "User not found." });

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Invalid password." });

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    res.status(200).json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in" });
  }
});
module.exports = router;
