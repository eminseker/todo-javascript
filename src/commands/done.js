"use strict";
/**
 * `done` komutu: verilen numaralı görevi tamamlandı olarak işaretler.
 *
 * Kullanım: node todo.js done 1
 */
const { parseId } = require("../utils/id");

module.exports = {
  name: "done",
  usage: "done <numara>",

  /**
   * @param {string[]} args Komutundan sonra gelen argümanlar.
   * @param {{service: object, out: Function}} ctx
   * @returns {number} Çıkış kodu.
   */
  run(args, ctx) {
    const id = parseId(args[0]);
    ctx.service.complete(id);
    ctx.out(`#${id} tamamlandı.`);
    return 0;
  },
};
