"use strict";
/**
 * `add` komutu: yeni görev ekler.
 *
 * Kullanım: node todo.js add "Kitap oku"
 * Birden fazla argüman boşlukla birleştirilerek başlık olarak kullanılır.
 */
module.exports = {
  name: "add",
  usage: 'add "<görev başlığı>"',

  /**
   * @param {string[]} args Komut sonrasındaki argümanlar.
   * @param {{service: object, out: Function}} ctx
   * @returns {number} Çıkış kodu.
   */
  run(args, ctx) {
    const title = args.join(" ");
    const id = ctx.service.add(title);
    ctx.out(`#${id} eklendi.`);
    return 0;
  },
};
