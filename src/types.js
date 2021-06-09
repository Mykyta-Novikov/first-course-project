/**
 * Class that represent special type of binary-safe strings.
 */
class BulkString extends String {
  /**
   * Checks if this is Null Bulk String.
   * @return {boolean} True if this is Null String, false otherwise.
   */
  isNil() {
    return this._isNil;
  }

  constructor(value) {
    super(value);
    this._isNil = !value;
  }
}

module.exports = {
  BulkString,
};
