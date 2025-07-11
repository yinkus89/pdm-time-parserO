require('dotenv').config(); // Import dotenv to use environment variables

const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

// Google OAuth2 Client setup using environment variables
const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,  // Using environment variables for security
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Google Calendar API setup
async function getGoogleCalendarEvents(auth) {
  const calendar = google.calendar({ version: 'v3', auth });
  try {
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    // Return the calendar events
    return res.data.items;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    throw new Error("Failed to fetch calendar events");
  }
}

// Function to get the OAuth2 token from the URL parameters
async function getAuthTokenFromUrl(code) {
  try {
    const { tokens } = await oAuth2Client.getToken(code); // Use the authorization code to get the token
    oAuth2Client.setCredentials(tokens); // Store the tokens in the OAuth2 client
    return tokens; // Return tokens to use for future requests
  } catch (error) {
    console.error("Error while getting tokens:", error);
    throw new Error("Failed to get OAuth2 tokens");
  }
}

module.exports = { getGoogleCalendarEvents, oAuth2Client, getAuthTokenFromUrl };
