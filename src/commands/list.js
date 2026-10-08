"use strict";
/**
 * `list` komutu: kayıtlı görevleri konsola listeler.
 *
 * Kullanım: node todo.js list
 */
const { formatTasks } = require("../utils/format");

module.exports = {
  name: "list",
  usage: "list",

  /**
   * @param {string[]} args Kullanılmaz.
   * @param {{service: object, out: Function}} ctx
   * @returns {number} Çıkış kodu.
   */
  run(args, ctx) {
    const tasks = ctx.service.list();
    if (tasks.length === 0) {
      ctx.out("Kayıtlı görev yok.");
      return 0;
    }
    ctx.out(formatTasks(tasks));
    return 0;
  },
};
