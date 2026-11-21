// Automated tests for the To-Do API
// Run with: node --test test.js
const test = require("node:test");
const assert = require("node:assert");

const BASE = "http://localhost:3000";

// Test 1: Home route
test("Home route returns welcome message", async () => {
  const res = await fetch(BASE + "/");
  assert.strictEqual(res.status, 200);
  assert.strictEqual(await res.text(), "Welcome to the To-Do API");
});

// Test 2: Get all tasks
test("GET /todos returns a list", async () => {
  const res = await fetch(BASE + "/todos");
  const data = await res.json();
  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(data));
});

// Test 3: Get one task
test("GET /todos/1 returns task 1", async () => {
  const res = await fetch(BASE + "/todos/1");
  const data = await res.json();
  assert.strictEqual(data.id, 1);
});

// Test 4: Edge case - task not found
test("GET /todos/99 returns 404", async () => {
  const res = await fetch(BASE + "/todos/99");
  assert.strictEqual(res.status, 404);
});

// Test 5: Add a task
test("POST /todos adds a new task", async () => {
  const res = await fetch(BASE + "/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task: "Write tests" }),
  });
  const data = await res.json();
  assert.strictEqual(res.status, 201);
  assert.strictEqual(data.task, "Write tests");
});

// Test 6: Edge case - empty task
test("POST /todos without task returns 400", async () => {
  const res = await fetch(BASE + "/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  assert.strictEqual(res.status, 400);
});

// Test 7: IDs must stay unique after deleting a task
test("IDs stay unique after deleting a task", async () => {
  await fetch(BASE + "/todos/1", { method: "DELETE" });
  await fetch(BASE + "/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task: "Another task" }),
  });
  const all = await (await fetch(BASE + "/todos")).json();
  const ids = all.map((t) => t.id);
  assert.strictEqual(new Set(ids).size, ids.length);
});

// Test 8: Delete a task
test("DELETE /todos/2 deletes the task", async () => {
  const res = await fetch(BASE + "/todos/2", { method: "DELETE" });
  const data = await res.json();
  assert.strictEqual(data.message, "Task deleted");
});