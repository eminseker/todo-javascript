"use strict";
/**
 * Veri erişim katmanı: görevlerin todo.json dosyasında kalıcılaştırılması.
 *
 * Yazma işlemi atomiktir: önce geçici dosyaya yazılır, sonra rename ile
 * hedef dosyanın üzerine alınır; böylece yarım kayıt oluşmaz.
 */
const fs = require("node:fs");
const path = require("node:path");
const { fromJSON } = require("./task");

/** Uygulama kökündeki varsayılan veri dosyası. */
const DEFAULT_FILE = path.join(__dirname, "..", "todo.json");

class Store {
  /**
   * @param {string} [filePath] Veri dosyasının yolu. Varsayılan: <proje>/todo.json
   */
  constructor(filePath = DEFAULT_FILE) {
    this.filePath = filePath;
  }

  /** Veri dosyası var mı? */
  exists() {
    return fs.existsSync(this.filePath);
  }

  /**
   * Görev listesini okur.
   * Dosya yoksa veya boşsa boş dize döndürür.
   * Kayıtlar task.fromJSON ile doğrulanarak modele dönüştürülür.
   *
   * @returns {Array<object>}
   */
  read() {
    if (!this.exists()) {
      return [];
    }
    const raw = fs.readFileSync(this.filePath, "utf8");
    if (raw.trim() === "") {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error("todo.json bir görev listesi içermiyor");
    }
    return parsed.map(fromJSON);
  }

  /**
   * Görev listesini atomik olarak yazar.
   * @param {Array<object>} tasks
   */
  write(tasks) {
    if (!Array.isArray(tasks)) {
      throw new TypeError("Yazılacak görevler bir dizi olmalı");
    }
    const directory = path.dirname(this.filePath);
    fs.mkdirSync(directory, { recursive: true });
    const tempFile = `${this.filePath}.${process.pid}.tmp`;
    try {
      fs.writeFileSync(tempFile, JSON.stringify(tasks, null, 2), "utf8");
      fs.renameSync(tempFile, this.filePath);
    } catch (hata) {
      // Başarısız yazma sonrası geçici dosyayı temizle.
      try {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      } catch {
        // yok say: asıl hata daha önemli
      }
      throw hata;
    }
  }

  /** Veri dosyasını siler (test ve sıfırlama için). */
  clear() {
    if (this.exists()) {
      fs.unlinkSync(this.filePath);
    }
  }
}

/**
 * @param {string} [filePath]
 * @returns {Store}
 */
function createStore(filePath) {
  return new Store(filePath);
}

module.exports = { Store, createStore, DEFAULT_FILE };
