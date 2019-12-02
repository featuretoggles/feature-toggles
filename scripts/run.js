const { argv } = require("yargs");

const run = () => {
  const examplePath = "../examples/";
  require(examplePath + argv._.join("/"));
};

run();
