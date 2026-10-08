const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const { addTask, completeTask, removeTask, loadTasks } = require("./todo");

const FILE_PATH = path.join(__dirname, "todo.json");

test.beforeEach(() => {
  if (fs.existsSync(FILE_PATH)) {
    fs.unlinkSync(FILE_PATH);
  }
});

test.after(() => {
  if (fs.existsSync(FILE_PATH)) {
    fs.unlinkSync(FILE_PATH);
  }
});

test("görev eklenir", () => {
  const id = addTask("Test görevi");
  assert.strictEqual(id, 1);
  const tasks = loadTasks();
  assert.strictEqual(tasks.length, 1);
  assert.strictEqual(tasks[0].title, "Test görevi");
  assert.strictEqual(tasks[0].done, false);
});

test("boş görev eklenemez", () => {
  assert.throws(() => addTask("   "), /boş olamaz/);
});

test("görev tamamlanır", () => {
  addTask("Yapılacak");
  completeTask(1);
  assert.strictEqual(loadTasks()[0].done, true);
});

test("var olmayan görev tamamlanamaz", () => {
  assert.throws(() => completeTask(99), /bulunamadı/);
});

test("görev silinir", () => {
  addTask("Bir");
  addTask("İki");
  removeTask(1);
  const tasks = loadTasks();
  assert.strictEqual(tasks.length, 1);
  assert.strictEqual(tasks[0].id, 2);
});
