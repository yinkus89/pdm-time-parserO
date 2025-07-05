// utils/dateParser.js
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

// Google Calendar API setup
async function getGoogleCalendarEvents(auth) {
  const calendar = google.calendar({ version: 'v3', auth });
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  
  return res.data.items;  // Return the calendar events
}

// Ambiguity clarification
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

// Duplicate check
let loggedEntries = []; // This stores previously logged entries

function isDuplicate(entry) {
  return loggedEntries.some(existingEntry =>
    existingEntry.task === entry.task &&
    existingEntry.project === entry.project &&
    existingEntry.date === entry.date &&
    existingEntry.employee === entry.employee
  );
}

function parseDate(dateStr) {
  const longFormat = /^\d{1,2} [A-Za-z]+, \d{4}$/;
  const shortFormat = /^\d{1,2}\/\d{1,2}\/\d{2}$/;

  if (longFormat.test(dateStr)) {
    return new Date(dateStr).toISOString().split('T')[0];
  } else if (shortFormat.test(dateStr)) {
    const [day, month, year] = dateStr.split('/').map(Number);
    const fullYear = 2000 + year;
    return new Date(fullYear, month - 1, day).toISOString().split('T')[0];
  }

  return null;
}

module.exports = { parseDate, parseTimeTaskLine, getGoogleCalendarEvents, isDuplicate };

