"use strict";
/**
 * İş kuralları katmanı (src/taskService.js) testleri.
 *
 * Not: Eski todo.test.js içindeki 5 testin karşılığı burada korunur;
 * kalıcılık testleri geçici dosyaya yazarak çalışır.
 */
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { TaskService, createService } = require("../src/taskService");
const { Store } = require("../src/store");
const { run, parseArgs } = require("../src/cli");

let filePath;
let service;

function tempFile() {
  return path.join(
    os.tmpdir(),
    `todo-service-test-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}.json`
  );
}

test.beforeEach(() => {
  filePath = tempFile();
  service = new TaskService(new Store(filePath));
});

test.afterEach(() => {
  fs.rmSync(filePath, { force: true });
});

// --- Eski todo.test.js testlerinin karşılığı ---

test("görev eklenir", () => {
  const id = service.add("Test görevi");
  assert.strictEqual(id, 1);
  const tasks = service.list();
  assert.strictEqual(tasks.length, 1);
  assert.strictEqual(tasks[0].title, "Test görevi");
  assert.strictEqual(tasks[0].done, false);
});

test("boş görev eklenemez", () => {
  assert.throws(() => service.add("   "), /boş olamaz/);
});

test("görev tamamlanır", () => {
  service.add("Yapılacak");
  service.complete(1);
  assert.strictEqual(service.list()[0].done, true);
});

test("var olmayan görev tamamlanamaz", () => {
  assert.throws(() => service.complete(99), /bulunamadı/);
});

test("görev silinir", () => {
  service.add("Bir");
  service.add("İki");
  service.remove(1);
  const tasks = service.list();
  assert.strictEqual(tasks.length, 1);
  assert.strictEqual(tasks[0].id, 2);
});

// --- Ek davranış testleri ---

test("var olmayan görev silinemez", () => {
  service.add("Tek görev");
  assert.throws(() => service.remove(42), /bulunamadı/);
  assert.strictEqual(service.list().length, 1);
});

test("silinen id yeniden üretilmez, id'ler artmaya devam eder", () => {
  service.add("Bir");
  service.add("İki");
  service.add("Üç");
  service.remove(2);
  assert.strictEqual(service.add("Dört"), 4);
  assert.deepStrictEqual(
    service.list().map((t) => t.id),
    [1, 3, 4]
  );
});

test("görev başlığı iki yandaki boşluklardan arındırılır", () => {
  service.add("   Kitap oku   ");
  assert.strictEqual(service.list()[0].title, "Kitap oku");
});

test("aynı görev iki kez tamamlanabilir (idempotent)", () => {
  service.add("Görev");
  service.complete(1);
  const first = service.complete(1);
  assert.strictEqual(first.done, true);
  assert.strictEqual(service.stats().done, 1);
});

test("stats tamamlayan ve bekleyen görevleri sayar", () => {
  service.add("A");
  service.add("B");
  service.complete(2);
  assert.deepStrictEqual(service.stats(), { total: 2, done: 1, active: 1 });
});

test("createService varsayılan olarak bir TaskService döndürür", () => {
  const injected = createService(new Store(filePath));
  assert.ok(injected instanceof TaskService);
  assert.strictEqual(injected.store.filePath, filePath);
});

// --- CLI yönlendirme (src/cli.js) ---

test("CLI add/list/done/remove akışı çalışır", () => {
  const lines = [];
  const io = { service, out: (line) => lines.push(line), err: (line) => lines.push(line) };

  assert.strictEqual(run(["add", "Kitap", "oku"], io), 0);
  assert.strictEqual(lines.pop(), "#1 eklendi.");

  assert.strictEqual(run(["list"], io), 0);
  assert.match(lines.pop(), /^\[ \] 1\. Kitap oku/);

  assert.strictEqual(run(["done", "1"], io), 0);
  assert.strictEqual(lines.pop(), "#1 tamamlandı.");

  assert.strictEqual(run(["remove", "1"], io), 0);
  assert.strictEqual(lines.pop(), "#1 silindi.");

  assert.strictEqual(run(["list"], io), 0);
  assert.strictEqual(lines.pop(), "Kayıtlı görev yok.");
});

test("CLI bilinmeyen komutta kullanım metni ve çıkış kodu 1 döner", () => {
  const lines = [];
  const io = { service, out: (line) => lines.push(line), err: (line) => lines.push(line) };
  assert.strictEqual(run(["frobnicate"], io), 1);
  assert.match(lines.pop(), /^Kullanım:/);
});

test("CLI hatalarda Hata: öneki ve çıkış kodu 1 döner", () => {
  const lines = [];
  const io = { service, out: (line) => lines.push(line), err: (line) => lines.push(line) };

  assert.strictEqual(run(["add", "   "], io), 1);
  assert.match(lines.pop(), /^Hata: .*boş olamaz/);

  assert.strictEqual(run(["done", "99"], io), 1);
  assert.match(lines.pop(), /^Hata: .*bulunamadı/);

  assert.strictEqual(run(["done", "abc"], io), 1);
  assert.match(lines.pop(), /^Hata: .*Geçersiz görev numarası/);

  assert.strictEqual(run(["done"], io), 1);
  assert.match(lines.pop(), /^Hata: .*numarası gerekli/);
});

test("parseArgs komut ve argümanları ayırır", () => {
  assert.deepStrictEqual(parseArgs(["add", "bir", "iki"]), {
    command: "add",
    args: ["bir", "iki"],
  });
  assert.deepStrictEqual(parseArgs([]), { command: undefined, args: [] });
});
