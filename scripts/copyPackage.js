import { argv } from "yargs";
import fs from "fs";
import pkg from "../package.json";
pkg.name = argv.name;
delete pkg.prepare;
const writable = fs.writeFileSync("./lib/package.json", JSON.stringify(pkg));
