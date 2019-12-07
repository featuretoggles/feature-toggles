import debug from "debug";
import { getToggles } from "./utils/getTogglesInfo";
import { argv } from "./utils/argvUtils";
const log = debug("feature-toggles:babel-plugin");
export default (babel, options = {}) => {
  const { types: t } = babel;
  const dir =
    process.env.TOGGLE_DIR || argv.toggleDir || options.dir || process.cwd();
  const defaultToggle =
    process.env.TOGGLE_NAME || argv.toggleName || options.toggleName;
  const allVisitors = Object.keys(t.VISITOR_KEYS)
    .filter(data => data !== "Program")
    .join("|");
  let togglesList = {};
  let toggles = {};
  if (dir && defaultToggle) {
    togglesList = getToggles(dir);
    toggles = togglesList[defaultToggle];
  }
  const listToggleName = {};
  const finalToggleList = {};
  const inFileConfig = "featureTogglesConfig:";
  const opt = {
    ...{
      commentStart: "toggleStart",
      commentEnd: "toggleEnd"
    },
    ...options
  };
  return {
    name: "feature-toggles", // not required
    visitor: {
      Program(path) {
        path.container.comments.forEach(data => {
          if (data.value.indexOf(inFileConfig) !== -1) {
            try {
              const overrideFeatureNames =
                JSON.parse(
                  data.value.replace(inFileConfig, "").replace(/\/n/, "")
                ) || {};
              toggles = { ...toggles, ...overrideFeatureNames };
            } catch (error) {
              throw Error(
                `Looks like you missed something in file config ${data.value}`
              );
            }
          }
          if (data.value.indexOf(opt.commentStart) !== -1) {
            const res = data.value.match(
              new RegExp(`${opt.commentStart}\\((.*)\\)`)
            );
            if ([undefined, true].indexOf(toggles[res[1]]) !== -1) return;
            listToggleName[res[1]] = listToggleName[res[1]] || [];
            if (
              listToggleName[res[1]].length &&
              listToggleName[res[1]].length - (1 % 2) === 0
            ) {
              throw Error(
                `Looks like you have continuously using  ${data.value}`
              );
            }
            listToggleName[res[1]].push(data.start);
          } else if (data.value.indexOf(opt.commentEnd) !== -1) {
            const res = data.value.match(
              new RegExp(`${opt.commentEnd}\\((.*)\\)`)
            );
            if ([undefined, true].indexOf(toggles[res[1]]) !== -1) return;
            if (
              listToggleName[res[1]].length &&
              listToggleName[res[1]].length % 2 === 0
            ) {
              throw Error(
                `Looks like you have continuously using  ${data.value}`
              );
            }
            listToggleName[res[1]].push(data.end);
          }
        });
        Object.keys(listToggleName).forEach((key, i) => {
          finalToggleList[key] = finalToggleList[key] || [];
          while (listToggleName[key].length)
            finalToggleList[key].push(listToggleName[key].splice(0, 2));
        });

        Object.keys(finalToggleList).forEach(name => {
          log(`"${name}" Applied at position %o`, finalToggleList[name]);
        });
      },
      [allVisitors](path) {
        Object.values(finalToggleList).forEach(data => {
          data.forEach(pos => {
            if (
              path.node &&
              pos[0] <= path.node.start &&
              pos[1] >= path.node.end
            ) {
              if (path.key === "expression") {
                path.parentPath.remove();
              } else {
                path.remove();
              }
            }
          });
        });
      }
    }
  };
};
