const meow = require("meow");
import command, * as commands from "./commands";
import { getHelp } from "./utils";

function run() {
  const meowConfig = {
    helps: {
      clean: `
          Usage:
              $ npx feature-toggles clean <path> <...options>
              path                     Files or directory to transform. Can be a glob like src/**.test.js
          Options:
              -t, --toggleName      Toggle flag name
                  --flag            Only remove comment condition
  
          Other Options:
              --force, -f              Bypass Git safety checks and forcibly run codemods
              --dry                    Dry run (no changes are made to files)
              --print                  Print transformed files to your terminal
              --explicit-require       Transform only if React is imported in the file (default: true)
              --jscodeshift            (Advanced) Pass options directly to jscodeshift
  
          Examples
              $ npx feature-toggles clean ./src  --toggleConfig=prod
          `
    },
    autoHelp: false,
    flags: {
      flag: {
        type: "boolean",
        default: false
      },
      force: {
        type: "boolean",
        default: false,
        alias: "f"
      },
      dry: {
        type: "boolean",
        default: false
      },
      print: {
        type: "boolean",
        default: false
      },
      "explicit-require": {
        type: "boolean",
        default: true
      }
    }
  };
  const cli = meow(
    `
        Usage
          $ npx feature-toggles <command> <path> <...options>
            path         Files or directory to transform. Can be a glob like src/**.test.js
        Commands: 
          clean              Clean the feature flags from the code.
  
        Options
          --help, -h           Bypass Git safety checks and forcibly run codemods
  
        Examples
          $ npx feature-toggles 
        `,
    meowConfig
  );
  if (cli.flags.h || cli.flags.help) {
    getHelp(cli.input, meowConfig.helps);
  }
  if (cli.input[0]) {
    return commands[`${cli.input[0]}Command`](cli);
  }
  return command(cli);
}

module.exports = {
  run: run
};
