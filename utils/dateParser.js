// utils/dateParser.js

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

module.exports = { parseDate };
