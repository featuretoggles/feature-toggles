import chalk from "chalk";
import isGitClean from "is-git-clean";
import execa from "execa";
import globby from "globby";
import path from "path";
import defaultConfig from "../defaultConfig";
const jscodeshiftExecutable = require.resolve(".bin/jscodeshift");

export function checkGitStatus(force) {
  let clean = false;
  let errorMessage = "Unable to determine if git directory is clean";
  try {
    clean = isGitClean.sync(process.cwd());
    errorMessage = "Git directory is not clean";
  } catch (err) {
    if (err && err.stderr && err.stderr.indexOf("Not a git repository") >= 0) {
      clean = true;
    }
  }

  if (!clean) {
    if (force) {
      console.log(`WARNING: ${errorMessage}. Forcibly continuing.`);
    } else {
      console.log("Thank you for using feature-toggles!");
      console.log(
        chalk.yellow(
          "\nBut before we continue, please stash or commit your git changes."
        )
      );
      console.log(
        "\nYou may use the --force flag to override this safety check."
      );
      process.exit(1);
    }
  }
}

export function runTransform({
  files,
  flags,
  parser,
  transformer,
  answers,
  transformerDirectory
}) {
  const transformerPath = path.join(transformerDirectory, `${transformer}.js`);

  let args = [];

  const {
    dry,
    print,
    explicitRequire,
    jscodeshift,
    flag,
    toggleFlagName,
    commentStart,
    commentEnd
  } = flags;

  if (dry) {
    args.push("--dry");
  }
  if (print) {
    args.push("--print");
  }

  if (explicitRequire === "false") {
    args.push("--explicit-require=false");
  }

  args.push("--verbose=2");

  args.push("--ignore-pattern=**/node_modules/**");

  args.push("--parser", parser);

  if (parser === "tsx") {
    args.push("--extensions=tsx,ts,jsx,js");
  } else {
    args.push("--extensions=jsx,js");
  }

  args = args.concat(["--transform", transformerPath]);

  args.push(`--commentStart=${commentStart || defaultConfig.commentStart}`);
  args.push(`--commentEnd=${commentEnd || defaultConfig.commentStart}`);

  if (toggleFlagName) {
    args.push(`--toggleFlagName=${toggleFlagName}`);
  }
  if (flag) {
    args.push(`--flag=true`);
  }
  if (jscodeshift) {
    args = args.concat(jscodeshift);
  }

  args = args.concat(files);

  console.log(`Executing command: jscodeshift ${args.join(" ")}`);

  const result = execa.sync(jscodeshiftExecutable, args, {
    stdio: "inherit",
    stripEof: false
  });

  if (result.error) {
    throw result.error;
  }
}

export function expandFilePathsIfNeeded(filesBeforeExpansion) {
  const shouldExpandFiles = filesBeforeExpansion.some(file =>
    file.includes("*")
  );
  return shouldExpandFiles
    ? globby.sync(filesBeforeExpansion)
    : filesBeforeExpansion;
}

export function getHelp(cli, meowConfig) {
  const childHelp = meowConfig[cli.input[0]];
  if (childHelp) {
    console.log(childHelp);
  } else {
    console.log(cli.help);
  }
  process.exit(0);
}
