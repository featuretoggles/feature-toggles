const fs = require("fs");
const path = require("path");
const defineInlineTest = require("jscodeshift/dist/testUtils").defineInlineTest;
const transform = require("../../transformer");
const fixtureInput = fs.readFileSync(
  path.resolve(
    __dirname,
    "../__testfixtures__/remove-toggled-code-according-to-config.input.js"
  ),
  {
    encoding: "utf8",
  }
);
const fixtureOut = fs.readFileSync(
  path.resolve(
    __dirname,
    "../__testfixtures__/remove-toggled-code-according-to-config.output.js"
  ),
  {
    encoding: "utf8",
  }
);
const transformOptions = {
  toggleFlagName: "feature-3",
  commentStart: "toggleStart",
  commentEnd: "toggleEnd",
};
defineInlineTest(transform, transformOptions, fixtureInput, fixtureOut);
