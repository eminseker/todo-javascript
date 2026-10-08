"use strict";
/**
 * Veri erişim katmanı (src/store.js) testleri:
 * okuma, atomik yazma ve bozuk veri durumları.
 */
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { Store, createStore, DEFAULT_FILE } = require("../src/store");

let filePath;
let store;

function tempFile() {
  return path.join(
    os.tmpdir(),
    `todo-store-test-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}.json`
  );
}

test.beforeEach(() => {
  filePath = tempFile();
  store = new Store(filePath);
});

test.afterEach(() => {
  fs.rmSync(filePath, { force: true });
  fs.rmSync(`${filePath}.${process.pid}.tmp`, { force: true });
});

test("dosya yoksa boş liste döner", () => {
  assert.strictEqual(store.exists(), false);
  assert.deepStrictEqual(store.read(), []);
});

test("boş dosya boş liste döner", () => {
  fs.writeFileSync(filePath, "   ", "utf8");
  assert.deepStrictEqual(store.read(), []);
});

test("yaz-oku tur (roundtrip) veriyi korur", () => {
  const tasks = [
    { id: 1, title: "Bir", done: false, createdAt: "2026-10-08T10:00:00.000Z" },
    { id: 2, title: "İki", done: true, createdAt: "2026-10-08T11:00:00.000Z" },
  ];
  store.write(tasks);
  assert.strictEqual(store.exists(), true);
  const loaded = store.read();
  assert.strictEqual(loaded.length, 2);
  assert.deepStrictEqual(loaded, tasks);
});

test("yazma atomiktir: geçici dosya bırakılmaz", () => {
  store.write([{ id: 1, title: "Tek", done: false, createdAt: "2026-10-08T10:00:00.000Z" }]);
  const tempFile = `${filePath}.${process.pid}.tmp`;
  assert.strictEqual(fs.existsSync(tempFile), false, "geçici dosya bırakılmamalı");
  assert.strictEqual(fs.readFileSync(filePath, "utf8").includes('"title": "Tek"'), true);
});

test("üzerine yazma eski içeriği tamamen değiştirir", () => {
  store.write([{ id: 1, title: "Eski", done: false, createdAt: "2026-10-08T10:00:00.000Z" }]);
  store.write([{ id: 2, title: "Yeni", done: true, createdAt: "2026-10-08T12:00:00.000Z" }]);
  const loaded = store.read();
  assert.strictEqual(loaded.length, 1);
  assert.strictEqual(loaded[0].title, "Yeni");
  assert.strictEqual(loaded[0].done, true);
});

test("geçersiz JSON okunamaz", () => {
  fs.writeFileSync(filePath, "{ bozuk json", "utf8");
  assert.throws(() => store.read(), SyntaxError);
});

test("JSON dizisi değilse açık hata verir", () => {
  fs.writeFileSync(filePath, JSON.stringify({ id: 1 }), "utf8");
  assert.throws(() => store.read(), /görev listesi içermiyor/);
});

test("bozuk görev kaydı hata üretir", () => {
  fs.writeFileSync(filePath, JSON.stringify([{ id: 1, title: "  " }]), "utf8");
  assert.throws(() => store.read(), /boş olamaz/);
});

test("write dizi dışında bir değer kabul etmez", () => {
  assert.throws(() => writeGuard(store, { id: 1 }), TypeError);
});

function writeGuard(targetStore, value) {
  targetStore.write(value);
}

test("clear veri dosyasını siler", () => {
  store.write([{ id: 1, title: "Silinecek", done: false, createdAt: "2026-10-08T10:00:00.000Z" }]);
  store.clear();
  assert.strictEqual(store.exists(), false);
  assert.deepStrictEqual(store.read(), []);
});

test("createStore varsayılan dosya yolunu kök dizine ayarlar", () => {
  const defaultStore = createStore();
  assert.strictEqual(defaultStore.filePath, DEFAULT_FILE);
  assert.ok(DEFAULT_FILE.endsWith("todo.json"));
  assert.ok(!DEFAULT_FILE.includes(`src${path.sep}`));
});
