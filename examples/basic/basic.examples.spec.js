import { transformFileSync } from "@babel/core";
import { transformFileSync as transformFS } from "babel-core";
import featureTogglePlugin from "../../src";

/**
 * Here this is a basic example get transpile by babel plugin
 */
it("BABEL7 - Basic function", () => {
  const { code } = transformFileSync(`${__dirname}/src/basic.js`, {
    rootMode: "upward",
    plugins: [[featureTogglePlugin, { dir: __dirname, toggleName: "ft1" }]]
  });
  expect(code).toMatchSnapshot();
});
it("BABEL6 - Basic function", () => {
  const { code } = transformFS(`${__dirname}/src/basic.js`, {
    plugins: [[featureTogglePlugin, { dir: __dirname, toggleName: "ft1" }]] //Option will not work here
  });
  expect(code).toMatchSnapshot();
});

it("BABEL7- React component function ", () => {
  const { code } = transformFileSync(`${__dirname}/src/ReactComponent.js`, {
    rootMode: "upward",
    plugins: [
      [featureTogglePlugin, { dir: __dirname, toggleName: "ft1" }],
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
it("BABEL6 - React component function with Argv", () => {
  const { code } = transformFS(`${__dirname}/src/ReactComponent.js`, {
    plugins: [[featureTogglePlugin, { dir: __dirname }], "transform-react-jsx"]
  });
  expect(code).toMatchSnapshot();
});
it("BABEL7 - Vue component function with Argv", () => {
  const { code } = transformFileSync(`${__dirname}/src/VueComponent.js`, {
    rootMode: "upward",
    plugins: [
      [featureTogglePlugin, { dir: __dirname }],
      "@babel/plugin-transform-react-jsx"
    ]
  });
  expect(code).toMatchSnapshot();
});
it("BABEL6 - Vue component function with Argv", () => {
  const { code } = transformFS(`${__dirname}/src/VueComponent.js`, {
    plugins: [[featureTogglePlugin, { dir: __dirname }], "transform-react-jsx"]
  });
  expect(code).toMatchSnapshot();
});
