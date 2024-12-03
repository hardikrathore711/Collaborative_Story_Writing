// src/models/User.js
const db = require('../db/knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function createUser(email, password, username) {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const [user] = await db('users')
      .insert({
        email,
        password: hashedPassword,
        username, // Add username to the insert query
      })
      .returning('*'); // Return the inserted user details
    return user;
  }

// Check if user exists and compare passwords
async function findUserByEmail(email) {
  const user = await db('users').where({ email }).first();
  return user;
}

// Generate JWT
function generateAuthToken(user) {
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return token;
}

module.exports = { createUser, findUserByEmail, generateAuthToken };
