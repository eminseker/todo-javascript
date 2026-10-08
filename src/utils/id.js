"use strict";
/**
 * Görev numarası (id) üretimi ve kullanıcıdan gelen id ayrıştırma yardımcıları.
 */

/**
 * Verilen görev listesindeki en büyük id'nin bir fazlasını döndürür.
 * Boş liste için 1 döner. Silinmiş görevlerin id'leri tekrar kullanılmaz.
 *
 * @param {Array<{id: number}>} tasks
 * @returns {number}
 */
function nextId(tasks) {
  if (!Array.isArray(tasks)) {
    throw new TypeError("Görev listesi bir dizi olmalı");
  }
  return tasks.reduce((max, task) => Math.max(max, Number(task.id) || 0), 0) + 1;
}

/**
 * Komut satırından gelen id değerini doğrular ve sayıya çevirir.
 *
 * @param {*} raw Örneğin "1"
 * @returns {number} Pozitif tam sayı
 */
function parseId(raw) {
  if (raw === undefined || raw === null || String(raw).trim() === "") {
    throw new Error("Görev numarası gerekli. Kullanım: <komut> <numara>");
  }
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Geçersiz görev numarası: ${raw}`);
  }
  return id;
}

module.exports = { nextId, parseId };
