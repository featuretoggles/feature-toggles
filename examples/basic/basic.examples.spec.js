import { transformFileSync } from "@babel/core";
import featureTogglePlugin from "../../src";

/**
 * Here this is a basic example get transpile by babel plugin
 */
it("Basic function", () => {
  const { code } = transformFileSync(`${__dirname}/src/basic.js`, {
    rootMode: "upward",
    plugins: [[featureTogglePlugin, { dir: __dirname, toggleName: "ft1" }]]
  });
  expect(code).toMatchSnapshot();
});

it("React component function", () => {
  const { code } = transformFileSync(`${__dirname}/src/ReactComponent.js`, {
    rootMode: "upward",
    plugins: [
      [featureTogglePlugin, { dir: __dirname, toggleName: "ft1" }],
      "@babel/plugin-transform-react-jsx"
    ]
  });
  expect(code).toMatchSnapshot();
});
