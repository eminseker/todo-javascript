"use strict";
/**
 * Görev (Task) modeli ve görev üstünde çalışan saf (side-effect'siz) işlevler.
 *
 * Bu modül dosyaya dokunmaz; yalnızca nesne üretir ve doğrular.
 */
const { nowIso } = require("./utils/date");

/**
 * Görev başlığını doğrular ve kırpılmış hâline döndürür.
 * @param {*} title
 * @returns {string}
 */
function validateTitle(title) {
  if (typeof title !== "string" || title.trim() === "") {
    throw new Error("Görev başlığı boş olamaz");
  }
  return title.trim();
}

/**
 * Yeni bir görev nesnesi üretir.
 * @param {number} id Pozitif tam sayı görev numarası.
 * @param {string} title Görev başlığı.
 * @param {{done?: boolean, createdAt?: string}} [options]
 * @returns {{id: number, title: string, done: boolean, createdAt: string}}
 */
function createTask(id, title, options = {}) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Geçersiz görev numarası: ${id}`);
  }
  return {
    id,
    title: validateTitle(title),
    done: Boolean(options.done),
    createdAt: typeof options.createdAt === "string" && options.createdAt
      ? options.createdAt
      : nowIso(),
  };
}

/**
 * JSON'dan okunan ham kaydı görev nesnesine dönüştürür.
 * Eksik alanları varsayılanlarla tamamlar.
 * @param {*} raw
 */
function fromJSON(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("Geçersiz görev kaydı");
  }
  return createTask(Number(raw.id), typeof raw.title === "string" ? raw.title : "", {
    done: Boolean(raw.done),
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : undefined,
  });
}

/**
 * Görevi tamamlandı olarak işaretleyen yeni nesneyi döndürür.
 * Girdi nesnesini değiştirmez (immutable).
 */
function markDone(task) {
  return { ...task, done: true };
}

/** Görev tamamlanmamışsa true. */
function isActive(task) {
  return !task.done;
}

/** Görev verilen numaraya sahipse true. */
function hasId(task, id) {
  return task.id === id;
}

module.exports = { validateTitle, createTask, fromJSON, markDone, isActive, hasId };
