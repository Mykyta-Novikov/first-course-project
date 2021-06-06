const cliCommands = {
  ...require("./commands"),
  ...require("./interactive"),
  ...require("./start-server"),
};

/**
 * Enum of global parameters of CLI.
 * @enum
 */
const parameters = [
  {
    name: "host",
    names: ["host", "h"],
    requiredValueFields: 1,
    default: ["127.0.0.1"],
  },
  {
    name: "port",
    names: ["port", "p"],
    requiredValueFields: 1,
    default: ["6379"],
  },
];

/**
 * Retrieves command line arguments and parses them. Calls appropriate function for command.
 */
function processCLI() {
  const clArguments = process.argv.slice(2);

  let parsedArguments = {};
  parameters
    .filter((item) => item.default)
    .forEach(
      (item) =>
        (parsedArguments[item.names[0]] = {
          values: item.default,
          definition: item,
        })
    ); // add default values for unfilled arguments

  for (let i = 0; i < clArguments.length; i++) {
    if (clArguments[i].startsWith("-")) {
      let maxRequiredValueFields = 0;

      let check_argument = (argument) => {
        const parameter = parameters.find((item) =>
          item.names.includes(argument)
        );
        if (parameter === undefined)
          throw new Error(
            `Unknown argument: ${
              clArguments[i].startsWith("--") ? "--" : "-"
            }${argument}`
          );

        parsedArguments[parameter.name] = {
          values: clArguments.slice(
            i + 1,
            i + parameter.requiredValueFields + 1
          ),
          definition: parameter,
        };
        maxRequiredValueFields =
          parameter.requiredValueFields > maxRequiredValueFields
            ? parameter.requiredValueFields
            : maxRequiredValueFields;
      };

      if (clArguments[i].startsWith("--"))
        check_argument(clArguments[i].slice(2));
      else clArguments[i].slice(1).split("").forEach(check_argument);
      i += maxRequiredValueFields;
    } else {
      if (!cliCommands[clArguments[i]])
        throw new Error(`Unknown command: ${clArguments[i]}`);
      else
        cliCommands[clArguments[i]](clArguments.slice(i + 1), parsedArguments);
      break;
    }
  }
}

module.exports = {
  processCLI,
};
