"use strict";
/**
 * Konsol çıktısı biçimlendirme yardımcıları.
 */
const { formatDate } = require("./date");

/**
 * Görevin durum simgesini döndürür: tamamlandıysa [x], değilse [ ].
 * @param {{done: boolean}} task
 */
function statusIcon(task) {
  return task.done ? "[x]" : "[ ]";
}

/**
 * Görevi satır biçiminde gösterir: `[ ] 1. Kitap oku (2026-10-08)`
 * Oluşturulma tarihi yoksa tarih kısmı atlanır.
 *
 * @param {{id: number, title: string, done: boolean, createdAt?: string}} task
 * @returns {string}
 */
function formatTask(task) {
  const line = `${statusIcon(task)} ${task.id}. ${task.title}`;
  const date = formatDate(task.createdAt);
  return date ? `${line} (${date})` : line;
}

/**
 * Görev listesini satır satır birleştirir.
 * @param {Array<object>} tasks
 * @returns {string}
 */
function formatTasks(tasks) {
  return tasks.map(formatTask).join("\n");
}

/**
 * Bilinmeyen komut için kullanım metni.
 * @returns {string}
 */
function usage() {
  return "Kullanım: node todo.js <add|list|done|remove> [argüman]";
}

module.exports = { statusIcon, formatTask, formatTasks, usage };
