require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const { parseDate } = require('./utils/dateParser');
const cors = require('cors');

// Initialize Express app
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());  // To handle JSON requests

// Google OAuth2 Client setup using environment variables
const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// MongoDB connection URI
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://juleyvonne3417:qkr07SGp3mCqDjIT@cluster0.mongodb.net/pdm-time-parser?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err);
    process.exit(1);
  });

// Define MongoDB Schema for logs
const logSchema = new mongoose.Schema({
  employee: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  task: { type: String, required: true },
  project: { type: String, required: true }
});

const Log = mongoose.model('Log', logSchema);  // MongoDB Model

// Fetch logs from MongoDB based on query parameters
app.get('/logs', async (req, res) => {
  const { employee, project, date, startTime, endTime, task } = req.query;
  let results = [];

  try {
    // Build the filter criteria dynamically based on query parameters
    const query = {
      ...(employee && { employee: new RegExp(employee, 'i') }),  // Case-insensitive search
      ...(project && { project: new RegExp(project, 'i') }),
      ...(date && { date: date }),
      ...(startTime && { startTime: { $gte: startTime } }),
      ...(endTime && { endTime: { $lte: endTime } }),
      ...(task && { task: new RegExp(task, 'i') })
    };

    // Fetch the logs from MongoDB
    results = await Log.find(query);

    if (results.length === 0) {
      return res.status(404).json({ message: 'No logs found for the given filters.' });
    }

    res.json(results);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).send('Error fetching logs');
  }
});

// POST: Create a new log entry
app.post('/create-log', async (req, res) => {
  const { employee, project, date, startTime, endTime, task } = req.body;

  if (!employee || !project || !date || !startTime || !endTime || !task) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newLog = new Log({
      employee,
      project,
      date,
      startTime,
      endTime,
      task,
    });

    await newLog.save();
    res.status(201).json({ message: 'Log created successfully!', log: newLog });
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).send('Error creating log');
  }
});

// PUT: Edit an existing log entry
app.put('/edit-log', async (req, res) => {
  const { employee, date, task, project, startTime, endTime } = req.body;

  if (!employee || !date || !task || !startTime || !endTime || !project) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await Log.findOneAndUpdate(
      { employee, date, task },
      { employee, date, task, project, startTime, endTime },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: 'Log not found for update' });
    }

    res.json({ message: 'Log updated successfully', log: result });
  } catch (error) {
    console.error('Error updating log:', error);
    res.status(500).json({ message: 'Error updating log' });
  }
});

// DELETE: Delete a log entry
app.delete('/delete-log', async (req, res) => {
  const { employee, date, task } = req.query;

  try {
    const result = await Log.deleteOne({ employee, date, task });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Log not found to delete.' });
    }

    res.json({ message: 'Log deleted successfully.' });
  } catch (error) {
    console.error('Error deleting log:', error);
    res.status(500).send('Error deleting log');
  }
});

// Google OAuth2 Client setup for Google Calendar
async function getGoogleCalendarEvents(auth) {
  const calendar = google.calendar({ version: 'v3', auth });
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  return res.data.items;
}

// Google Login: Generate Google OAuth URL
app.get('/auth', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.readonly'],
  });
  res.redirect(authUrl);
});

// Callback after Google Login to fetch tokens
app.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Authorization code missing');
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);  // Store credentials for future API calls
    res.json({ message: 'Authentication successful', tokens });
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    res.status(500).send('Error exchanging code for tokens');
  }
});

// Fetch Google Calendar Events
app.get('/fetch-calendar', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('Google OAuth2 token is required');
  }

  try {
    oAuth2Client.setCredentials({ access_token: token });
    const events = await getGoogleCalendarEvents(oAuth2Client);
    res.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).send('Error fetching calendar events');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}/logs`);
});
