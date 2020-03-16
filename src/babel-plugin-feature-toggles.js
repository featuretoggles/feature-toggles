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
  const adjustNodeAndUpdate = node => {
    if (
      ["left", "right"].includes(node.key) &&
      !t.isAssignmentExpression(node.parentPath)
    ) {
      if (node.key == "right") {
        node.parentPath.replaceWith(node.parent["left"]);
      } else if (node.key == "left") {
        node.parentPath.replaceWith(node.parent["right"]);
      }
    } else if (t.isIfStatement(node.parentPath)) {
      if (node.key === "alternate") {
        node.remove();
      }
    } else if (["object", "property"].includes(node.key)) {
      if (node.key == "object") {
        if (node.parent["property"].node) {
          node.parentPath.replaceWith(node.parent["property"]);
        }
      } else if (node.key == "property") {
        if (node.parent["object"].node) {
          if (t.isCallExpression(node.parent["object"])) {
            node.parentPath.replaceWith(node.parent["object"].callee);
          } else {
            node.parentPath.parentPath.replaceWith(node.parent["object"]);
          }
        }
      }
    }
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
          t.removeComments(data);
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
              t.removeComments(path.node);
              if (!isNaN(path.key)) {
                path.remove();
              } else {
                adjustNodeAndUpdate(path);
              }
            }
          });
        });
      }
    }
  };
};
