# PDM Time Parser
This tool parses free-text time logs from multiple employees into structured JSON entries. It's built to support the PDM technical interview case.

## Features
- Handles different date formats (`1 April, 2025` and `2/4/25`)
- Extracts start time, end time, task descriptions
- Groups logs by employee and date

## How to Run

1. Place your raw logs in `appendix1.txt`
2. Run the parser:

```bash
node parser.js
