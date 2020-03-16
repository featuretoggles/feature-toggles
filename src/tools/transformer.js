import reqAll from "../utils/requireAll";
import path from "path";

module.exports = function(file, api, options) {
  const transforms = reqAll({
    dirPath: path.resolve(__dirname, "./transforms")
  });
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
