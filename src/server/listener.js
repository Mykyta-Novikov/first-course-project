let RESP = require("./../resp");
let parseRequest = require("./parse-request");
let commandImplementations = {
  ping,
};

/**
 * Listener to net.Server connection event that parses request, processes it, and encodes and sends response
 * @param {Socket} connection Newly obtained connection to a client.
 */
function serverListener(connection) {
  connection.once("error", (err) => connection.write(RESP.encode(err)));

  connection.addListener("data", (data) => {
    let request = RESP.parse(data.toString());
    if (!Array.isArray(request))
      throw new Error(`Request is not parsable RESP string: ${data}`);

    let command = parseRequest(request);
    let response = commandImplementations[command.name](command);
    connection.write(RESP.encode(response));
  });
}

/**
 * Test command implementation that just sends a string in response.
 * @param {Command} command Does not contain any useful information;
 * @return {respStructure} Always the "PONG" string.
 */
function ping(command) {
  return "PONG";
}

module.exports = {
  serverListener,
};
