"use strict";
/**
 * İş kuralları katmanı: ekleme, tamamlama, silme ve listeleme.
 *
 * Servis bir Store enjansiyonu alır; böylece testler geçici dosya ile
 * çalışabilir ve CLI varsayılan todo.json dosyasını kullanabilir.
 */
const { createStore } = require("./store");
const { createTask, validateTitle, markDone, hasId } = require("./task");
const { nextId } = require("./utils/id");

class TaskService {
  /**
   * @param {import("./store").Store} [store]
   */
  constructor(store = createStore()) {
    this.store = store;
  }

  /**
   * Kayıtlı görevlerin kopyasını döndürür.
   * @returns {Array<object>}
   */
  list() {
    return this.store.read();
  }

  /**
   * Yeni görev ekler.
   * @param {string} title Görev başlığı (boş olamaz).
   * @returns {number} Oluşturulan görevin numarası.
   */
  add(title) {
    const cleanTitle = validateTitle(title);
    const tasks = this.store.read();
    const task = createTask(nextId(tasks), cleanTitle);
    tasks.push(task);
    this.store.write(tasks);
    return task.id;
  }

  /**
   * Verilen numaralı görevi tamamlandı olarak işaretler.
   * @param {number} id
   * @returns {object} Güncellenmiş görev.
   */
  complete(id) {
    const tasks = this.store.read();
    const index = tasks.findIndex((task) => hasId(task, id));
    if (index === -1) {
      throw new Error(`#${id} numaralı görev bulunamadı`);
    }
    tasks[index] = markDone(tasks[index]);
    this.store.write(tasks);
    return tasks[index];
  }

  /**
   * Verilen numaralı görevi siler.
   * @param {number} id
   * @returns {number} Silme sonrası kalan görev sayısı.
   */
  remove(id) {
    const tasks = this.store.read();
    const remaining = tasks.filter((task) => !hasId(task, id));
    if (remaining.length === tasks.length) {
      throw new Error(`#${id} numaralı görev bulunamadı`);
    }
    this.store.write(remaining);
    return remaining.length;
  }

  /**
   * Liste hakkında kısa istatistik döndürür.
   * @returns {{total: number, done: number, active: number}}
   */
  stats() {
    const tasks = this.list();
    const done = tasks.filter((task) => task.done).length;
    return { total: tasks.length, done, active: tasks.length - done };
  }
}

/**
 * @param {import("./store").Store} [store]
 * @returns {TaskService}
 */
function createService(store) {
  return new TaskService(store);
}

module.exports = { TaskService, createService };
