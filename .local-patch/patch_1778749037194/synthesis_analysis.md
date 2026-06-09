Here is the improved code:

// tools/content-calendar/config.json
{
  "id": "content-calendar",
  "name": "Content Calendar",
  "description": "Weekly content planning grid with export capabilities.",
  "category": "creators",
  "audience": ["creators"],
  "inputs": [],
  "outputs": ["exported calendar", "calendar data"],
  "tags": ["planning", "calendar", "content creation"]
}

// tools/content-calendar/index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Content Calendar</title>
    <link rel="stylesheet" href="../../../shared/shared.css">
</head>
<body>
    <h1 id="calendar-header">Content Calendar</h1>
    <div id="calendar-container"></div>
    <script src="../../../tools/content-calendar/tool.js"></script>
</body>
</html>

// tools/content-calendar/tool.js
import { ToolStorage } from "../../../shared/tool-storage.js";

class ContentCalendar {
  constructor() {
    this.storage = new ToolStorage("content-calendar");
    this.calendarContainer = document.getElementById("calendar-container");
  }

  async init() {
    const calendarData = await this.storage.load();
    if (calendarData) {
      this.renderCalendar(calendarData);
    } else {
      this.createInitialCalendar();
    }
  }

  createInitialCalendar() {
    // Create initial calendar grid
    const calendarGrid = document.createElement("table");
    for (let i = 0; i < 7; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < 7; j++) {
        const cell = document.createElement("td");
        cell.textContent = `${i}x${j}`;
        row.appendChild(cell);
      }
      calendarGrid.appendChild(row);
    }
    this.calendarContainer.appendChild(calendarGrid);

    // Add export button
    const exportButton = document.createElement("button");
    exportButton.textContent = "Export Calendar";
    exportButton.addEventListener("click", async () => {
      try {
        const exportedCalendar = await this.storage.export();
        console.log(exportedCalendar);
      } catch (error) {
        console.error(error);
      }
    });
    this.calendarContainer.appendChild(exportButton);
  }

  renderCalendar(calendarData) {
    // Render calendar grid with data
    const calendarGrid = document.createElement("table");
    for (let i = 0; i < 7; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < 7; j++) {
        const cell = document.createElement("td");
        cell.textContent = `${calendarData[i][j]}`;
        row.appendChild(cell);
      }
      calendarGrid.appendChild(row);
    }
    this.calendarContainer.appendChild(calendarGrid);

    // Add export button
    const exportButton = document.createElement("button");
    exportButton.textContent = "Export Calendar";
    exportButton.addEventListener("click", async () => {
      try {
        const exportedCalendar = await this.storage.export();
        console.log(exportedCalendar);
      } catch (error) {
        console.error(error);
      }
    });
    this.calendarContainer.appendChild(exportButton);
  }
}

const calendarTool = new ContentCalendar();
calendarTool.init();

// shared/tool-registry.js
import { ToolRegistry } from "../../../shared/tool-registry.js";

const toolRegistry = new ToolRegistry();
toolRegistry.add("tools/content-calendar");

// router.js
import { Router } from "../../../shared/router.js";
import { contentCalendar } from "./tools/content-calendar";

Router.get("/content-calendar", () => {
  return contentCalendar;
});