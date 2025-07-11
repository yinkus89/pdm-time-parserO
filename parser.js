const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Load CLI arguments
const argv = yargs(hideBin(process.argv)).argv;

const { parseDate } = require('./utils/dateParser');

// Read the appendix1.txt file (log entries)
const rawText = fs.readFileSync(path.join(__dirname, 'appendix1.txt'), 'utf-8');
const lines = rawText.split('\n').map(line => line.trim()).filter(Boolean);

// Load appendix2.json (task-to-project mappings)
const appendix2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'appendix2.json'), 'utf-8'));

// Create task-to-project mapping (case-insensitive)
const taskToProjectMap = {};
for (const [project, tasks] of Object.entries(appendix2)) {
  tasks.forEach(task => {
    taskToProjectMap[task.trim().toLowerCase()] = project;
  });
}

let currentEmployee = '';
let currentDate = '';
const entries = [];

// Helper function to parse time task line
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
  const normalize = t => t.includes(':') ? t : `${t}:00`;  // Ensure the time format is HH:mm

  return {
    startTime: normalize(start),
    endTime: normalize(end),
    task: task?.trim() || ''
  };
}

// Loop through the lines of appendix1.txt and parse each log entry
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
    // Normalize task name to lowercase to ensure case-insensitive matching
    const normalizedTask = parsed.task.trim().toLowerCase();
    const project = taskToProjectMap[normalizedTask] || "Unmapped";  // Default to "Unmapped" if no project found

    // Push the parsed log entry into the entries array
    entries.push({
      employee: currentEmployee,
      date: currentDate,
      ...parsed,
      project
    });
  }
}

// === Filter based on CLI arguments ===
let filteredEntries = entries;

if (argv.employee) {
  filteredEntries = filteredEntries.filter(e =>
    e.employee.toLowerCase().includes(argv.employee.toLowerCase())
  );
}

if (argv.project) {
  filteredEntries = filteredEntries.filter(e =>
    e.project.toLowerCase().includes(argv.project.toLowerCase())
  );
}

if (argv.date) {
  filteredEntries = filteredEntries.filter(e =>
    e.date === argv.date
  );
}

// Write the filtered logs to output.json
const outputPath = path.join(__dirname, 'output.json');
fs.writeFileSync(outputPath, JSON.stringify(filteredEntries, null, 2), 'utf-8');
console.log(`✅ Filtered output saved to output.json (${filteredEntries.length} entries)`);

