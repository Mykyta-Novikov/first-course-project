/**
 * Global-level abstraction of hashtable access. Is singleton.
 * At this moment implemented via standard Map.
 * @type {Map<BulkString, BulkString|Array>}
 */
class Hashtable extends Map {
  /**
   * Provider of instances of this class.
   * @return {Hashtable} Singleton instance of Hashtable.
   */
  static getInstance() {
    return Hashtable.instance || (Hashtable.instance = new Hashtable());
  }
}

module.exports = Hashtable;
