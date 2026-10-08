#!/usr/bin/env node
/**
 * Yapılacaklar listesi (todo) — Node.js örneği.
 *
 * Kullanım:
 *   node todo.js add "Kitap oku"
 *   node todo.js list
 *   node todo.js done 1
 *   node todo.js remove 1
 *
 * Veriler todo.json dosyasında saklanır.
 */
const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, "todo.json");

function loadTasks() {
  if (!fs.existsSync(FILE_PATH)) {
    return [];
  }
  const raw = fs.readFileSync(FILE_PATH, "utf8");
  return raw.trim() ? JSON.parse(raw) : [];
}

function saveTasks(tasks) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2), "utf8");
}

function addTask(title) {
  if (!title || !title.trim()) {
    throw new Error("Görev başlığı boş olamaz");
  }
  const tasks = loadTasks();
  const nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  tasks.push({ id: nextId, title: title.trim(), done: false });
  saveTasks(tasks);
  return nextId;
}

function listTasks() {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log("Kayıtlı görev yok.");
    return;
  }
  for (const task of tasks) {
    const durum = task.done ? "[x]" : "[ ]";
    console.log(`${durum} ${task.id}. ${task.title}`);
  }
}

function completeTask(id) {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    throw new Error(`#${id} numaralı görev bulunamadı`);
  }
  task.done = true;
  saveTasks(tasks);
}

function removeTask(id) {
  const tasks = loadTasks();
  const kalan = tasks.filter((t) => t.id !== id);
  if (kalan.length === tasks.length) {
    throw new Error(`#${id} numaralı görev bulunamadı`);
  }
  saveTasks(kalan);
}

function main(argv) {
  const [komut, ...args] = argv;
  try {
    switch (komut) {
      case "add": {
        const id = addTask(args.join(" "));
        console.log(`#${id} eklendi.`);
        break;
      }
      case "list":
        listTasks();
        break;
      case "done":
        completeTask(Number(args[0]));
        console.log(`#${args[0]} tamamlandı.`);
        break;
      case "remove":
        removeTask(Number(args[0]));
        console.log(`#${args[0]} silindi.`);
        break;
      default:
        console.log("Kullanım: node todo.js <add|list|done|remove> [argüman]");
        process.exitCode = 1;
    }
  } catch (hata) {
    console.error(`Hata: ${hata.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = { addTask, completeTask, removeTask, loadTasks };
