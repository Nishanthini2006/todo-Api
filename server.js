// To-Do List API using Node.js and Express
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Allows the server to read JSON data
app.use(express.json());
// Logging: prints every request (useful for monitoring)
app.use((req, res, next) => {
  console.log(new Date().toISOString() + " " + req.method + " " + req.url);
  next();
});

// Health check route (used to monitor the deployed app)
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Sample data (stored in memory)
let todos = [
  { id: 1, task: "Learn Node.js", done: true },
  { id: 2, task: "Build a project", done: false },
];

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to the To-Do API");
});

// Get all tasks
app.get("/todos", (req, res) => {
  res.json(todos);
});

// Get one task by id
app.get("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json(todo);
});

// Add a new task
app.post("/todos", (req, res) => {
  if (!req.body.task) {
    return res.status(400).json({ message: "Task is required" });
  }
  const newTodo = {
     id: todos.length ? Math.max(...todos.map((t) => t.id)) + 1 : 1,
    task: req.body.task,
    done: false,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Delete a task
app.delete("/todos/:id", (req, res) => {
  todos = todos.filter((t) => t.id !== Number(req.params.id));
  res.json({ message: "Task deleted" });
});

// Start the server
app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});