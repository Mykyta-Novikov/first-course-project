let { BulkString } = require("./../../types");
let db = require("./hashtable").getInstance();

/**
 * Sets value of a key as a string.
 * @param {string} key The key.
 * @param {BulkString} value Value of the key.
 */
function set(key, value) {
  db.set(key, value);
}

/**
 * Gets the value of a key as a string.
 * @param {string} key The key.
 * @return {BulkString} Value of the key.
 */
function get(key) {
  let result = db.get(key);

  if (!result) result = new BulkString(null);
  else if (!result instanceof BulkString)
    throw new TypeError(
      "Operation against a key holding the wrong kind of value"
    );
  return result;
}

/**
 * Deletes value of the key.
 * @param {string} key The key.
 * @return {boolean} True if the key existed before operation, false otherwise.
 */
function deleteValue(key) {
  return db.delete(key);
}

module.exports = {
  set,
  get,
  deleteValue,
};
