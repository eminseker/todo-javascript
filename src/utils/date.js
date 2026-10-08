"use strict";
/**
 * Tarih yardımcıları: görev oluşturulma zamanı üretimi ve gösterimi.
 */

/**
 * Geçerli ISO-8601 zaman damgası üretir (örn. 2026-10-08T09:30:00.000Z).
 * @returns {string}
 */
function nowIso() {
  return new Date().toISOString();
}

/**
 * Değerin geçerli bir tarih olup olmadığını kontrol eder.
 * @param {*} value
 * @returns {boolean}
 */
function isValidDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return !Number.isNaN(date.getTime());
}

/**
 * ISO zaman damgasını kısa biçimde (YYYY-MM-DD) gösterir.
 * Geçersiz değerler için boş dize döndürür.
 *
 * @param {*} value
 * @returns {string}
 */
function formatDate(value) {
  if (!isValidDate(value)) {
    return "";
  }
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 10);
}

/**
 * İki zaman damgasının aynı güne ait olup olmadığını söyler.
 */
function isSameDay(a, b) {
  if (!isValidDate(a) || !isValidDate(b)) {
    return false;
  }
  return formatDate(a) === formatDate(b);
}

module.exports = { nowIso, isValidDate, formatDate, isSameDay };
