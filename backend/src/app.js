const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const cors = require('cors');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Explicitly configure CORS to allow all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

const MONGODB_URI = process.env.CONNECTION_STRING || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/votingSystem';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
