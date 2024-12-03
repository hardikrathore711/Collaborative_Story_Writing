const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');  // Import the auth routes
const storyRoutes = require('./routes/story');
const { authenticateToken } = require('./middlewares/authMiddleware');
 // Import the middleware

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand')
dotenvExpand.expand(dotenv.config())
// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Use the auth routes (for login, signup, etc.)
app.use('/api/auth', authRoutes);  // All auth-related routes will be prefixed with /api/auth
app.use('/api/stories', authenticateToken, storyRoutes);

// Protect routes that need authentication
const testRoute = require('./routes/index');
app.use('/api',authenticateToken, testRoute);
  // Only /api routes require token authentication

// Root route to test if server is running
app.get('/', (req, res) => {
  res.send('Welcome to the Story Platform API!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
