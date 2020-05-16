import { transformFileSync } from "@babel/core";
import featureTogglePlugin from "../../src";
/**
 * Here this is a basic example get transpile by babel plugin
 */
it("BABEL7 - Basic function", () => {
  const { code } = transformFileSync(`${__dirname}/src/basic.js`, {
    rootMode: "upward",
    plugins: [[featureTogglePlugin, { dir: __dirname, toggleConfig: "ft1" }]]
  });
  expect(code).toMatchSnapshot();
});

it("BABEL7- React component function ", () => {
  const { code } = transformFileSync(`${__dirname}/src/ReactComponent.js`, {
    plugins: [
      [featureTogglePlugin, { dir: __dirname, toggleConfig: "ft1" }],
      "@babel/plugin-transform-react-jsx"
    ]
  });
  expect(code).toMatchSnapshot();
});
it("BABEL7 - React component function with Argv", () => {
  const { code } = transformFileSync(`${__dirname}/src/ReactComponent.js`, {
    rootMode: "upward",
    plugins: [
      [featureTogglePlugin, { dir: __dirname }],
      "@babel/plugin-transform-react-jsx"
    ]
  });
  expect(code).toMatchSnapshot();
});

it("BABEL7 - Vue component function with Argv", () => {
  const { code } = transformFileSync(`${__dirname}/src/VueComponent.js`, {
    rootMode: "upward",
    plugins: [[featureTogglePlugin, { dir: __dirname }]]
  });
  expect(code).toMatchSnapshot();
});
