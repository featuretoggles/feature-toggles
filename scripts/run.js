const argv = require("yargs").argv;
console.log(argv)
const run = () => {
    const examplePath = "../examples/"
    require(examplePath + argv._.join("/"))
}

run()

