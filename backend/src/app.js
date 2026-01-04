const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const cors = require('cors');
const Election = require('./models/electionModel');
const Candidate = require('./models/candidateModel');

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

// Seed a demo election with four Indian candidates if none exist
async function seedInitialData() {
  const existingElection = await Election.findOne({ title: 'Demo Election' });

  let election = existingElection;
  if (!election) {
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    election = await Election.create({
      title: 'Demo Election',
      description: 'Sample election preloaded with four Indian candidates.',
      startDate: now,
      endDate: oneWeekFromNow,
    });
    console.log('Created demo election');
  }

  const electionId = election._id.toString();
  const existingCandidates = await Candidate.countDocuments({ election: electionId });
  if (existingCandidates > 0) {
    console.log('Candidates already exist for demo election');
    return;
  }

  const candidates = [
    { name: 'Ananya Sharma', party: 'Progressive India Front', election: electionId },
    { name: 'Rohan Iyer', party: 'Unity for All', election: electionId },
    { name: 'Kavya Nair', party: 'Green Bharat Alliance', election: electionId },
    { name: 'Arjun Mehta', party: 'People First Coalition', election: electionId },
  ];

  await Candidate.insertMany(candidates);
  console.log('Seeded demo election with four Indian candidates');
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedInitialData().catch((err) => console.error('Seed error:', err.message));
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use('/', routes);

// Listen on 0.0.0.0 to accept connections from anywhere (required for Render)
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Backend ready to accept connections');
});
