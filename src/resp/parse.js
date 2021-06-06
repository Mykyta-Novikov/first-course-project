/**
 * Parses respString into respStructure
 * @param {respString} respString RESP string to be parsed.
 * @returns {respStructure} Parsed string
 */
module.exports = function (respString) {
  return respString.split(" ");
};
