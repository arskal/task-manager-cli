#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const TASKS_FILE = path.join(__dirname, "tasks.json");

// --- Helpers ---

function loadTasks() {
  if (!fs.existsSync(TASKS_FILE)) return [];
  return JSON.parse(fs.readFileSync(TASKS_FILE, "utf-8"));
}

function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

function generateId(tasks) {
  return tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
}

// --- Commands ---

function addTask(title) {
  if (!title) {
    console.error("Error: Please provide a task title. Example: node index.js add \"Buy groceries\"");
    process.exit(1);
  }
  const tasks = loadTasks();
  const newTask = {
    id: generateId(tasks),
    title,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  console.log(`✅ Task added: [${newTask.id}] ${newTask.title}`);
}

function listTasks(filter) {
  let tasks = loadTasks();

  if (filter) {
    const validStatuses = ["pending", "done"];
    if (!validStatuses.includes(filter)) {
      console.error(`Error: Invalid filter "${filter}". Use "pending" or "done".`);
      process.exit(1);
    }
    tasks = tasks.filter((t) => t.status === filter);
  }

  if (tasks.length === 0) {
    console.log(filter ? `No ${filter} tasks found.` : "No tasks yet. Add one with: node index.js add \"Task name\"");
    return;
  }

  console.log(`\n📋 Tasks${filter ? ` (${filter})` : ""}:\n`);
  tasks.forEach((t) => {
    const icon = t.status === "done" ? "✔" : "○";
    console.log(`  ${icon} [${t.id}] ${t.title}  (${t.status})`);
  });
  console.log("");
}

function completeTask(id) {
  if (!id) {
    console.error("Error: Please provide a task ID. Example: node index.js complete 1");
    process.exit(1);
  }
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === parseInt(id));
  if (!task) {
    console.error(`Error: No task found with ID ${id}`);
    process.exit(1);
  }
  task.status = "done";
  saveTasks(tasks);
  console.log(`✔  Task marked as done: [${task.id}] ${task.title}`);
}

function deleteTask(id) {
  if (!id) {
    console.error("Error: Please provide a task ID. Example: node index.js delete 1");
    process.exit(1);
  }
  let tasks = loadTasks();
  const index = tasks.findIndex((t) => t.id === parseInt(id));
  if (index === -1) {
    console.error(`Error: No task found with ID ${id}`);
    process.exit(1);
  }
  const [removed] = tasks.splice(index, 1);
  saveTasks(tasks);
  console.log(`🗑  Task deleted: [${removed.id}] ${removed.title}`);
}

function showHelp() {
  console.log(`
Task Manager CLI — Commands:

  node index.js add "<title>"        Add a new task
  node index.js list                 List all tasks
  node index.js list --filter done   List only done tasks
  node index.js list --filter pending List only pending tasks
  node index.js complete <id>        Mark a task as done
  node index.js delete <id>          Delete a task
  node index.js help                 Show this help message
`);
}

// --- Router ---

const [,, command, ...args] = process.argv;

switch (command) {
  case "add":
    addTask(args.join(" "));
    break;
  case "list": {
    const filterIndex = args.indexOf("--filter");
    const filter = filterIndex !== -1 ? args[filterIndex + 1] : null;
    listTasks(filter);
    break;
  }
  case "complete":
    completeTask(args[0]);
    break;
  case "delete":
    deleteTask(args[0]);
    break;
  case "help":
  case undefined:
    showHelp();
    break;
  default:
    console.error(`Unknown command: "${command}". Run "node index.js help" for usage.`);
    process.exit(1);
}
