const fs = require('fs');
const path = require('path');
const { parseDate } = require('./utils/dateParser');

const rawText = fs.readFileSync(path.join(__dirname, 'appendix1.txt'), 'utf-8');
const lines = rawText.split('\n').map(line => line.trim()).filter(Boolean);

let currentEmployee = '';
let currentDate = '';
const entries = [];

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
  if (!timeMatch) return null;

  let [_, start, end] = timeMatch;
  const normalize = t => t.includes(':') ? t : `${t}:00`;

  return {
    startTime: normalize(start),
    endTime: normalize(end),
    task: task?.trim() || ''
  };
}

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
    entries.push({
      employee: currentEmployee,
      date: currentDate,
      ...parsed,
    });
  }
}

console.log(entries);
