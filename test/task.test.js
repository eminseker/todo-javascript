"use strict";
/**
 * Görev modeli (src/task.js) ve yardımcılar (src/utils/*) için birim testleri.
 */
const test = require("node:test");
const assert = require("node:assert");

const {
  validateTitle,
  createTask,
  fromJSON,
  markDone,
  isActive,
  hasId,
} = require("../src/task");
const { nextId, parseId } = require("../src/utils/id");
const { nowIso, formatDate, isValidDate, isSameDay } = require("../src/utils/date");
const { statusIcon, formatTask, formatTasks, usage } = require("../src/utils/format");

test("createTask beklenen alanlarla görev üretir", () => {
  const task = createTask(1, "Test görevi");
  assert.strictEqual(task.id, 1);
  assert.strictEqual(task.title, "Test görevi");
  assert.strictEqual(task.done, false);
  assert.ok(isValidDate(task.createdAt));
});

test("boş başlıkla görev oluşturulamaz", () => {
  assert.throws(() => createTask(1, "   "), /boş olamaz/);
  assert.throws(() => validateTitle(undefined), /boş olamaz/);
  assert.throws(() => createTask(1, 42), /boş olamaz/);
});

test("geçersiz id ile görev oluşturulamaz", () => {
  assert.throws(() => createTask(0, "Başlık"), /Geçersiz görev numarası/);
  assert.throws(() => createTask(-3, "Başlık"), /Geçersiz görev numarası/);
  assert.throws(() => createTask(1.5, "Başlık"), /Geçersiz görev numarası/);
});

test("validateTitle başlığı kırpıp döndürür", () => {
  assert.strictEqual(validateTitle("  Kitap oku  "), "Kitap oku");
});

test("markDone özgün görevi değiştirmez", () => {
  const original = createTask(1, "Yapılacak");
  const done = markDone(original);
  assert.strictEqual(original.done, false);
  assert.strictEqual(done.done, true);
  assert.strictEqual(done.id, 1);
  assert.strictEqual(done.title, "Yapılacak");
});

test("isActive ve hasId doğru sonuç verir", () => {
  const task = createTask(7, "Görev");
  assert.strictEqual(isActive(task), true);
  assert.strictEqual(hasId(task, 7), true);
  assert.strictEqual(hasId(task, 8), false);
  assert.strictEqual(isActive(markDone(task)), false);
});

test("fromJSON eksik alanları varsayılanlarla tamamlar", () => {
  const task = fromJSON({ id: "3", title: "Eski kayıt", done: 1 });
  assert.strictEqual(task.id, 3);
  assert.strictEqual(task.title, "Eski kayıt");
  assert.strictEqual(task.done, true);
  assert.ok(isValidDate(task.createdAt));
  assert.throws(() => fromJSON(null), /Geçersiz görev kaydı/);
  assert.throws(() => fromJSON({ title: "idsiz" }), /Geçersiz görev numarası/);
});

test("nextId en büyük id'nin bir fazlasını verir", () => {
  assert.strictEqual(nextId([]), 1);
  assert.strictEqual(nextId([{ id: 1 }, { id: 5 }, { id: 3 }]), 6);
  // silinmiş id'ler tekrar üretilmez
  assert.strictEqual(nextId([{ id: 2 }, { id: 4 }]), 5);
  assert.throws(() => nextId("dizi değil"), TypeError);
});

test("parseId geçerli ve geçersiz değerleri ayrıştırır", () => {
  assert.strictEqual(parseId("1"), 1);
  assert.strictEqual(parseId(12), 12);
  assert.throws(() => parseId(undefined), /numarası gerekli/);
  assert.throws(() => parseId("  "), /numarası gerekli/);
  assert.throws(() => parseId("abc"), /Geçersiz görev numarası/);
  assert.throws(() => parseId("0"), /Geçersiz görev numarası/);
  assert.throws(() => parseId("-2"), /Geçersiz görev numarası/);
});

test("date yardımcıları ISO damgası üretir ve formatlar", () => {
  const now = nowIso();
  assert.ok(isValidDate(now));
  assert.match(now, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  assert.strictEqual(formatDate("2026-10-08T12:00:00.000Z"), "2026-10-08");
  assert.strictEqual(formatDate("bozuk tarih"), "");
  assert.strictEqual(isSameDay(now, now), true);
  assert.strictEqual(isSameDay(now, "bozuk"), false);
});

test("format yardımcıları okunabilir satır üretir", () => {
  const task = { id: 1, title: "Kitap oku", done: false, createdAt: "2026-10-08T10:00:00.000Z" };
  assert.strictEqual(statusIcon(task), "[ ]");
  assert.strictEqual(statusIcon({ ...task, done: true }), "[x]");
  assert.strictEqual(formatTask(task), "[ ] 1. Kitap oku (2026-10-08)");
  assert.strictEqual(formatTask({ id: 2, title: "Eski", done: true }), "[x] 2. Eski");
  assert.strictEqual(
    formatTasks([task, { ...task, id: 2, done: true }]),
    "[ ] 1. Kitap oku (2026-10-08)\n[x] 2. Kitap oku (2026-10-08)"
  );
  assert.match(usage(), /<add\|list\|done\|remove>/);
});
