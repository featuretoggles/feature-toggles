import { transformFileSync } from "@babel/core"
import featureTogglePlugin from "../../src/babel-feature-toggle-plugin"

/**
 * Here this is a basic example get transpile by babel plugin
 */
const { code } = transformFileSync(__dirname + "/src/basic.js", {
    rootMode: "upward",
    plugins: [
        [featureTogglePlugin, { dir: __dirname, toggleName: "ft1" }]
    ]
});
console.log(code)
