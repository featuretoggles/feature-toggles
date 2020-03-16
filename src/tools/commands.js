import path from "path";
import { checkGitStatus, expandFilePathsIfNeeded, runTransform } from "./utils";

const transformerDirectory = path.join(__dirname, "");

export const cleanCommand = cli => {
  if (!cli.flags.dry) {
    checkGitStatus(cli.flags.force);
  }
  const filesBeforeExpansion = cli.input[1] || ".";
  const filesExpanded = expandFilePathsIfNeeded([filesBeforeExpansion]);

  const selectedTransformer = "transformer";
  const selectedParser = cli.flags.parser || "babel";

  if (!filesExpanded.length) {
    console.log(`No files found matching ${filesBeforeExpansion.join(" ")}`);
    return null;
  }
  return runTransform({
    files: filesExpanded,
    flags: cli.flags,
    parser: selectedParser,
    transformer: selectedTransformer,
    transformerDirectory
  });
};

export default () => {};
