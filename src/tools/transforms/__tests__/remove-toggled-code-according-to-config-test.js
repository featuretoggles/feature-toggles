const defineTest = require("jscodeshift/dist/testUtils").defineTest;
describe("remove-toggled-code-according-to-config", () => {
  defineTest(__dirname, "remove-toggled-code-according-to-config", {
    toggleName: "feature-3",
    commentStart: "toggleStart",
    commentEnd: "toggleEnd",
  });
});
