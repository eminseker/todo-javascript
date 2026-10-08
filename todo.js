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
 *
 * Bu dosya yalnızca giriştir; tüm iş src/ altında modüler olarak düzenlenmiştir.
 */
const { run } = require("./src/cli");
const { createService } = require("./src/taskService");

if (require.main === module) {
  process.exitCode = run(process.argv.slice(2));
}

// Geriye dönük uyumluluk: eski kamu API'si korunur.
const defaultService = createService();

module.exports = {
  addTask: (title) => defaultService.add(title),
  completeTask: (id) => defaultService.complete(id),
  removeTask: (id) => defaultService.remove(id),
  loadTasks: () => defaultService.list(),
  run,
};
