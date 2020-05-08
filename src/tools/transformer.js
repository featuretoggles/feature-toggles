import path from "path";
import fs from "fs";

import defaultConf from "../defaultConfig";
import reqAll from "../utils/requireAll";

module.exports = function(file, api, options) {
  let transforms = reqAll({
    dirPath: path.resolve(__dirname, "./transforms")
  });
  if (
    fs.existsSync(path.resolve(process.cwd(), defaultConf.customTransformPath))
  ) {
    const customTransforms = reqAll({
      dirPath: path.resolve(process.cwd(), defaultConf.customTransformPath)
    });
    transforms = { ...transforms, ...customTransforms };
  }
  let src = file.source;
  Object.values(transforms).forEach(transform => {
    if (typeof src === "undefined") {
      return;
    }
    if (typeof transform != "function") {
      transform = transform.default;
    }
    const nextSrc = transform({ ...file, source: src }, api, options);

    if (nextSrc) {
      src = nextSrc;
    }
  });
  return src;
};
