# Task Manager CLI

A command-line task manager built with Node.js. Week 1 project for professional developer training.

## Features

- Add tasks
- List all tasks (or filter by status)
- Mark tasks as complete
- Delete tasks
- Runs inside Docker — works identically on any machine

## Usage (Local — requires Node.js)

```bash
node index.js add "Buy groceries"
node index.js list
node index.js list --filter pending
node index.js list --filter done
node index.js complete 1
node index.js delete 1
node index.js help
```

## Usage (Docker)

```bash
# Build the image
docker build -t task-manager .

# Add a task
docker run --rm -v $(pwd)/tasks.json:/app/tasks.json task-manager node index.js add "Buy groceries"

# List tasks
docker run --rm -v $(pwd)/tasks.json:/app/tasks.json task-manager node index.js list

# Filter tasks
docker run --rm -v $(pwd)/tasks.json:/app/tasks.json task-manager node index.js list --filter pending
```

> The `-v $(pwd)/tasks.json:/app/tasks.json` flag mounts your local `tasks.json` into the container so data persists between runs.

## Project Structure

```
task-manager/
├── index.js        # Main CLI app
├── tasks.json      # Auto-created when you add your first task (gitignored)
├── package.json
├── Dockerfile
├── .dockerignore
├── .gitignore
└── README.md
```

## Git Workflow Used

This project follows the **Feature Branch Workflow**:
1. `main` branch holds stable, working code
2. New features are built on a separate branch (e.g., `feature/filter-command`)
3. Branches are merged into `main` via Pull Request
