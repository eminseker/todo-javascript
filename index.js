"use strict";
/**
 * Paket girişi (package.json "main").
 *
 * Kütüphene olarak kullanım:
 *   const todo = require("./index");
 *   const service = todo.createService();
 *   service.add("Kitap oku");
 *
 * Komut satırı olarak da çalıştırılabilir:
 *   node index.js list
 */
const task = require("./src/task");
const store = require("./src/store");
const taskService = require("./src/taskService");
const cli = require("./src/cli");
const idUtils = require("./src/utils/id");
const dateUtils = require("./src/utils/date");
const format = require("./src/utils/format");

module.exports = {
  // Modeller ve servis
  validateTitle: task.validateTitle,
  createTask: task.createTask,
  markDone: task.markDone,
  Store: store.Store,
  createStore: store.createStore,
  DEFAULT_STORE_FILE: store.DEFAULT_FILE,
  TaskService: taskService.TaskService,
  createService: taskService.createService,
  // Yardımcılar
  nextId: idUtils.nextId,
  parseId: idUtils.parseId,
  nowIso: dateUtils.nowIso,
  formatDate: dateUtils.formatDate,
  formatTask: format.formatTask,
  formatTasks: format.formatTasks,
  // CLI
  run: cli.run,
  parseArgs: cli.parseArgs,
};

if (require.main === module) {
  process.exitCode = cli.run(process.argv.slice(2));
}
