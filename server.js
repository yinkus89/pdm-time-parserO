const express = require('express');
const fs = require('fs');
const path = require('path');
const { parseDate } = require('./utils/dateParser');

const app = express();
const PORT = 3000;
const cors = require('cors');
app.use(cors());


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

// Parser function
function parseLogs() {
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
      const normalizedTask = parsed.task.trim().toLowerCase();
      const project = taskToProjectMap[normalizedTask] || "Unmapped";

      entries.push({
        employee: currentEmployee,
        date: currentDate,
        ...parsed,
        project
      });
    }
  }

  return entries;
}

// API route
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

// Utility function to convert time strings (e.g., "9:00") to minutes
function timeToMinutes(t) {
  const [hours, minutes] = t.split(':').map(Number);
  return hours * 60 + (minutes || 0);
}

// New summary endpoint
app.get('/summary', (req, res) => {
  const logs = parseLogs();
  const summaryByEmployee = {};
  const summaryByProject = {};

  logs.forEach(log => {
    const duration = timeToMinutes(log.endTime) - timeToMinutes(log.startTime);

    // Sum hours per employee
    if (!summaryByEmployee[log.employee]) {
      summaryByEmployee[log.employee] = 0;
    }
    summaryByEmployee[log.employee] += duration;

    // Sum hours per project
    if (!summaryByProject[log.project]) {
      summaryByProject[log.project] = 0;
    }
    summaryByProject[log.project] += duration;
  });

  // Convert minutes to hours rounded to 2 decimals
  const convert = (obj) =>
    Object.entries(obj).map(([key, minutes]) => ({
      name: key,
      hours: +(minutes / 60).toFixed(2),
    }));

  res.json({
    byEmployee: convert(summaryByEmployee),
    byProject: convert(summaryByProject),
  });
});


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}/logs`);
});
