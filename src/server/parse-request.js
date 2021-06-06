let commands = require("./commands.json");

/**
 * Class representing a lexical token (a command or an option).
 */
class Token {
  /**
   * Checks whether all present subtokens are appropriate and compatible with each other,
   * and there is appropriate amount of fields.
   * @returns {boolean} True if all conditions are fulfilled, false otherwise.
   */
  check() {
    if (this.subtokens.some((subtoken) => !commands[subtoken.name]))
      return false;

    let presentOptions = this.subtokens.map(
      (subtoken) => commands[subtoken.name]
    );
    if (
      this.subtokens.some((subtoken) =>
        presentOptions.find(
          (option) =>
            option.incompatible ||
            option.incompatible.find((value) => value === subtoken.name)
        )
      )
    )
      return false;

    let checkFields = (token) =>
      this.fields.length > commands[token.name].fields.max ||
      this.fields.length < commands[token.name].fields.max;

    return !(checkFields(this) || this.subtokens.some(checkFields));
  }

  /**
   * Casts all tokens and all subtokens fields to their required types.
   * @throws {Error} If type is unknown or field isn't correct instance of it's type.
   */
  castFields() {
    let checkType = (tokenName) => (field, index) => {
      let type = commands[tokenName].types
        ? commands[tokenName].types.keys()[
            commands[tokenName].types
              .values()
              .find((value) => value.contains(index))
          ]
        : "string";

      switch (type) {
        case "string":
          return field;
        case "integer":
          let parsed = Number.parseInt(field);
          if (isNaN(parsed))
            throw new Error("Integer cannot be parsed: " + field);
          else return parsed;
        default:
          throw new Error("Unknown type: " + type);
      }
    };

    this.fields = this.fields.map(checkType(this.name));
    this.subtokens.forEach(
      (subtoken) =>
        (subtoken.fields = subtoken.fields.map(checkType(subtoken.name)))
    );
  }

  constructor(name, fields, ...subtokens) {
    this.name = name;
    this.fields = fields;

    this.subtokens = [];
    if (subtokens) this.subtokens.push(...subtokens);
  }
}

/**
 * Class that represents parsed command with fields and options.
 */
class Command {
  /**
   * Creates Command using data from token.
   * @param {Token} token Token? used to create Command.
   * @return new instance of Command with data from token.
   */
  static fromToken(token) {
    let command = new Command(token.name);

    command.options = Object.fromEntries(
      token.subtokens.map((value) => [value.name, value])
    );

    let fieldNames = commands[token.name].fields.names || [];

    command.fields = Object.fromEntries(
      token.fields.map((field, index) => [fieldNames[index] || index, field])
    );

    return command;
  }

  constructor(name) {
    this.name = name;
    this.fields = {};
    this.options = {};
  }
}

/**
 * Parses request as an array of strings into object.
 * @param {Array<string>} request
 */
function parseRequest(request) {
  request = request.map((value) => value.toLocaleLowerCase());

  let command = request[0];
  if (!commands[command]) throw new Error("Command not recognized: " + command);

  let optionNames = Object.keys(commands[command].options);
  let tokenIndexes = request
    .slice(1)
    .map((value, index) => ({ index, value }))
    .filter((string) => optionNames.includes(string.value))
    .map((string) => string.index);

  let commandToken = new Token(command, request.slice(1, tokenIndexes[0]));
  tokenIndexes.forEach((tokenIndex, index) =>
    commandToken.subtokens.push(
      new Token(
        request[tokenIndex],
        request.slice(tokenIndex + 1, tokenIndexes[index + 1])
      )
    )
  );

  if (!commandToken.check()) throw new Error("Command cannot be recognized");
  commandToken.castFields();
  return Command.fromToken(commandToken);
}

module.exports = parseRequest;
