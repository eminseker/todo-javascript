"use strict";
/**
 * CLI katmanı: argv ayrıştırma, komut kaydı ve yönlendirme.
 *
 * Çıkış kodları: başarılı → 0, hata/bilinmeyen komut → 1
 */
const { createService } = require("./taskService");
const { usage } = require("./utils/format");

/** Kayıtlı komutlar: ad → komut modülü */
const COMMANDS = Object.assign(Object.create(null), {
  add: require("./commands/add"),
  list: require("./commands/list"),
  done: require("./commands/done"),
  remove: require("./commands/remove"),
});

/**
 * argv dizisini komut ve argümanlara ayırır.
 * @param {string[]} argv process.argv.slice(2) gibi bir dizi
 * @returns {{command: string|undefined, args: string[]}}
 */
function parseArgs(argv) {
  const [command, ...args] = Array.isArray(argv) ? argv : [];
  return { command, args };
}

/**
 * Komut satırını çalıştırır.
 *
 * @param {string[]} argv
 * @param {{out?: Function, err?: Function, service?: object}} [io] Bağımlılıklar (test için enjekte edilebilir).
 * @returns {number} Çıkış kodu.
 */
function run(argv, io = {}) {
  const out = typeof io.out === "function" ? io.out : console.log;
  const err = typeof io.err === "function" ? io.err : console.error;
  const service = io.service || createService();

  const { command, args } = parseArgs(argv);
  const handler = command ? COMMANDS[command] : undefined;
  if (!handler) {
    out(usage());
    return 1;
  }

  try {
    return handler.run(args, { service, out, err });
  } catch (hata) {
    err(`Hata: ${hata.message}`);
    return 1;
  }
}

module.exports = { run, parseArgs, COMMANDS };
