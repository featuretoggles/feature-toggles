import { transformFileSync } from "@babel/core";
import { transformFileSync as transformFS } from "babel-core";
import featureTogglePlugin from "../../src";

/**
 * Here this is a basic example get transpile by babel plugin
 */

const { code } = transformFS(`${__dirname}/src/basic.js`, {
  rootMode: "upward",
  plugins: [[featureTogglePlugin, { dir: __dirname, toggleConfig: "ft1" }]]
});
console.log(code);

const { code: reactCode } = transformFileSync(
  `${__dirname}/src/ReactComponent.js`,
  {
    rootMode: "upward",
    plugins: [
      [featureTogglePlugin, { dir: __dirname, toggleName: "ft1" }],
      "@babel/plugin-transform-react-jsx"
    ]
  }
);
console.log(reactCode);
