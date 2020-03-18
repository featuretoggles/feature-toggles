jest.autoMockOff();
const defineTest = require("jscodeshift/dist/testUtils").defineTest;
defineTest(__dirname, "clean-up-empty-jsx-expressions", {
  toggleName: "feature-3"
});
