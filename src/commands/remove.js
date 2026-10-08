"use strict";
/**
 * `remove` komutu: verilen numaralı görevi siler.
 *
 * Kullanım: node todo.js remove 1
 */
const { parseId } = require("../utils/id");

module.exports = {
  name: "remove",
  usage: "remove <numara>",

  /**
   * @param {string[]} args Komutundan sonra gelen argümanlar.
   * @param {{service: object, out: Function}} ctx
   * @returns {number} Çıkış kodu.
   */
  run(args, ctx) {
    const id = parseId(args[0]);
    ctx.service.remove(id);
    ctx.out(`#${id} silindi.`);
    return 0;
  },
};
