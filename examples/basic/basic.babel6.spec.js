import { transformFileSync as transformFS } from "babel-core";
import featureTogglePlugin from "../../src";

/**
 * Here this is a basic example get transpile by babel plugin
 */

it("BABEL6 - Basic function", () => {
  const { code } = transformFS(`${__dirname}/src/basic.js`, {
    plugins: [featureTogglePlugin], //Option will not work here
  });
  expect(code).toMatchSnapshot();
});

it("BABEL6 - React component function with Argv", () => {
  const { code } = transformFS(`${__dirname}/src/ReactComponent.js`, {
    plugins: [featureTogglePlugin, "transform-react-jsx"],
  });
  expect(code).toMatchSnapshot();
});

it("BABEL6 - Vue component function with Argv", () => {
  const { code } = transformFS(`${__dirname}/src/VueComponent.js`, {
    plugins: [featureTogglePlugin],
  });
  expect(code).toMatchSnapshot();
});
