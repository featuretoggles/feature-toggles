jest.autoMockOff();
const defineTest = require("jscodeshift/dist/testUtils").defineTest;
describe("remove-toggled-flag-according-to-config", () => {
  defineTest(
    __dirname,
    "remove-toggled-code-according-to-config",
    {
      toggleFlagName: "feature-3",
      commentStart: "toggleStart",
      commentEnd: "toggleEnd",
      flag: true,
    },
    "remove-toggled-flag-according-to-config"
  );
});
