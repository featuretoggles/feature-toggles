jest.autoMockOff();
const defineTest = require("jscodeshift/dist/testUtils").defineTest;
defineTest(__dirname, "remove-toggled-code-according-to-config", {
  toggleName: "feature-3"
});
