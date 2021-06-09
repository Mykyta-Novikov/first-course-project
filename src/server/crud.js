let operations = require("./db/general");
let { BulkString } = require("../types");

/**
 * Controller for SET commands.
 * Checks XX (key already exists) and NX (key doesn't already exist) conditions, sets the value,
 * and returns appropriate response.
 * @param {Command} command Information about command. Must contain key field;
 * may contain value field, and XX, NX and GET options.
 * @return {string|BulkString} Either previous value (if GET option is set) or "OK" string.
 */
function setController(command) {
  let oldValue;
  if (command.options.xx || command.options.nx || command.options.get)
    // old value is only needed if one of those is set
    oldValue = operations.get(command.fields.key);

  if (
    (command.options.nx && !oldValue.isNil()) ||
    (command.options.xx && oldValue.isNil())
  )
    return new BulkString(null);
  else {
    operations.set(
      command.fields.key,
      new BulkString(command.fields.value || "")
    );

    if (command.options.get) return oldValue;
    else return "OK";
  }
}

/**
 * Controller for GET commands. Returns the value of the key.
 * @param {Command} command Information about command. Must contain key field.
 * @return {BulkString} Value of the key.
 */
function getController(command) {
  return operations.get(command.fields.key);
}

/**
 * Controller for DEL commands. Deletes the key.
 * @param {Command} command Information about command. Must contain key field.
 * @return {number} Number of deleted keys.
 */
function deleteController(command) {
  return operations.deleteValue(command.fields.key) ? 1 : 0;
}

/**
 * Controller for GETDEL commands. Deletes the key and return it's value.
 * @param {Command} command Information about command. Must contain key field.
 * @return {BulkString} Value of the key before deletion.
 */
function getDeleteController(command) {
  let oldValue = operations.get(command.fields.key);
  if (!oldValue.isNil()) operations.deleteValue(command.fields.key);
  return oldValue;
}

module.exports = {
  set: setController,
  get: getController,
  del: deleteController,
  getdel: getDeleteController,
};
