// Import dotenv to load environment variables from the .env file
require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const { parseDate } = require('./utils/dateParser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());  // To handle JSON requests

// Google OAuth2 Client setup using environment variables loaded from .env
const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,  // Using environment variables for security
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Load data once (appendix1 and 2)
const rawText = fs.readFileSync(path.join(__dirname, 'appendix1.txt'), 'utf-8');
const appendix2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'appendix2.json'), 'utf-8'));
const lines = rawText.split('\n').map(line => line.trim()).filter(Boolean);

// Create task-to-project map
const taskToProjectMap = {};
for (const [project, tasks] of Object.entries(appendix2)) {
  tasks.forEach(task => {
    taskToProjectMap[task.trim().toLowerCase()] = project;
  });
}

// Store previously logged entries to prevent duplicates
let loggedEntries = [];

// Google Calendar API setup
async function getGoogleCalendarEvents(auth) {
  try {
    const calendar = google.calendar({ version: 'v3', auth });
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return res.data.items;  // Return the calendar events
  } catch (error) {
    throw new Error('Error fetching Google Calendar events');
  }
}

// Ambiguity clarification for time parsing
function parseTimeTaskLine(line) {
  const arrowSplit = line.split('→');
  let timePart, task;

  if (arrowSplit.length === 2) {
    [timePart, task] = arrowSplit.map(s => s.trim());
  } else {
    const match = line.match(/^(.+?)(?=\s+[^\d\s])/);
    if (match) {
      timePart = match[0].trim();
      task = line.replace(timePart, '').trim();
    }
  }

  const timeMatch = timePart?.match(/(\d{1,2}[:.]?\d{0,2})\s*[–-]\s*(\d{1,2}[:.]?\d{0,2})/);
  if (!timeMatch) return { error: "Unable to parse time, please clarify!" };  // Ambiguous input.

  let [_, start, end] = timeMatch;
  const normalize = t => t.includes(':') ? t : `${t}:00`;

  return {
    startTime: normalize(start),
    endTime: normalize(end),
    task: task?.trim() || ''
  };
}

// Duplicate check function
function isDuplicate(entry) {
  return loggedEntries.some(existingEntry =>
    existingEntry.task === entry.task &&
    existingEntry.project === entry.project &&
    existingEntry.date === entry.date &&
    existingEntry.employee === entry.employee
  );
}

// Parse logs function
function parseLogs() {
  let currentEmployee = '';
  let currentDate = '';
  const entries = [];

  for (const line of lines) {
    const empMatch = line.match(/^Employee \d+:\s+(.+)/);
    if (empMatch) {
      currentEmployee = empMatch[1];
      continue;
    }

    const maybeDate = parseDate(line);
    if (maybeDate) {
      currentDate = maybeDate;
      continue;
    }

    const parsed = parseTimeTaskLine(line);
    if (parsed && currentEmployee && currentDate) {
      const normalizedTask = parsed.task.trim().toLowerCase();
      const project = taskToProjectMap[normalizedTask] || "Unmapped";

      // Check for duplicates before adding
      const entry = {
        employee: currentEmployee,
        date: currentDate,
        ...parsed,
        project
      };

      if (!isDuplicate(entry)) {
        entries.push(entry);
        loggedEntries.push(entry);  // Store entry for future checks
      }
    }
  }

  return entries;
}

// Main API route for fetching logs
app.get('/logs', (req, res) => {
  const { employee, project, date } = req.query;
  let results = parseLogs();

  if (employee) {
    results = results.filter(e =>
      e.employee.toLowerCase().includes(employee.toLowerCase())
    );
  }

  if (project) {
    results = results.filter(e =>
      e.project.toLowerCase().includes(project.toLowerCase())
    );
  }

  if (date) {
    results = results.filter(e => e.date === date);
  }

  res.json(results);
});

// Google Calendar API route
app.get('/fetch-calendar', async (req, res) => {
  const { token } = req.query;
  
  if (!token) {
    return res.status(400).send('Google OAuth2 token is required');
  }

  try {
    oAuth2Client.setCredentials({ access_token: token });
    const events = await getGoogleCalendarEvents(oAuth2Client);
    res.json(events);  // Return fetched events
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching calendar events');
  }
});

// OAuth2 Authentication Route
app.get('/auth', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.readonly'], // or adjust based on your needs
  });
  res.redirect(authUrl);
});

// OAuth2 Callback Route (after Google redirect)
app.get('/callback', async (req, res) => {
  const { code } = req.query; // The code returned by Google after user authentication

  if (!code) {
    return res.status(400).send('Authorization code missing');
  }

  try {
    // Exchange the authorization code for tokens
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);  // Store credentials for future API calls

    res.json({ message: 'Authentication successful', tokens });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error exchanging code for tokens');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}/logs`);
});
