let parse = require("./parse");
let encode = require("./encode");
let { BulkString } = require("../types");

/**
 * Parses a command into array of RESP BulkStrings.
 * @param {string} command String to be parsed.
 * @returns {respStructure}
 */
function command(command) {
  return command.split(" ").map((value) => new BulkString(value));
}

/**
 * Object containing methods for processing RESP.
 * @typedef {string|BulkString|Error|Number|Array<respStructure>|null} respStructure All types that
 * a RESP-encoded string can contain.
 * @typedef {string} respString String encoded in resp.
 * @type {{
 *  encode: function(respStructure): respString,
 *  parse: function(respString): respStructure,
 *  command: function(string): respStructure
 * }}
 */
let RESP = {
  parse,
  encode,
  command,
};

module.exports = RESP;
