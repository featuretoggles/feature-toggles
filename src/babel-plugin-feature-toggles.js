import debug from "debug";
import { getToggles, getTheToggleFolder } from "./utils/getTogglesInfo";
import { argv } from "./utils/argvUtils";
import defaultConfig from "./defaultConfig";
const log = debug("feature-toggles:babel-plugin");
export default (babel, options = {}) => {
  const { types: t } = babel;

  const dir =
    process.env.TOGGLE_DIR || argv.toggleDir || options.dir || process.cwd();
  const defaultToggle =
    process.env.TOGGLE_CONFIG_NAME || argv.toggleConfig || options.toggleConfig;
  const allVisitors = Object.keys(t.VISITOR_KEYS)
    .filter(data => data !== "Program")
    .join("|");
  let togglesList = {};
  let toggles = {};
  if (dir && defaultToggle) {
    togglesList = getToggles(getTheToggleFolder(dir, options));
    toggles = togglesList[defaultToggle];
  }
  const inFileConfig = "featureTogglesConfig:";
  const opt = {
    ...defaultConfig,
    ...options
  };
  const checkPosition = (path, pos) => {
    return path.node && pos[0] <= path.node.start && pos[1] >= path.node.end;
  };
  const adjustNodeAndUpdate = (node, pos) => {
    if (
      ["left", "right"].includes(node.key) &&
      !t.isAssignmentExpression(node.parentPath)
    ) {
      if (node.key == "right" && node.parent["left"]) {
        node.parentPath.replaceWith(node.parent["left"]);
      } else if (node.key == "left" && node.parent["right"]) {
        node.parentPath.replaceWith(node.parent["right"]);
      }
    } else if (t.isIfStatement(node.parentPath)) {
      if (checkPosition(node, pos)) {
        switch (node.key) {
          case "test":
            if (!node.parent.alternate) {
              node.parentPath.replaceWith(node.parent.consequent);
            }
            break;
          case "consequent":
            node.parentPath.replaceWith(node.parent.alternate);
            break;
          case "alternate":
            node.remove();
            break;
        }
      }
    } else if (["object", "property"].includes(node.key)) {
      if (node.key == "object") {
        if (node.parent["property"].node) {
          node.parentPath.replaceWith(node.parent["property"]);
        }
      } else if (node.key == "property") {
        if (node.parent["object"]) {
          if (t.isCallExpression(node.parent["object"])) {
            node.parentPath.replaceWith(node.parent["object"].callee);
          } else {
            node.parentPath.parentPath.replaceWith(node.parent["object"]);
          }
        }
      }
    } else if (node.key === "superClass") {
      node.remove();
    }
  };
  return {
    name: "feature-toggles", // not required
    visitor: {
      Program(path, state) {
        const listToggleName = {};
        const finalToggleList = {};
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
        if (log.enabled) {
          Object.keys(finalToggleList).forEach(name => {
            log(`"${name}" Applied at position %o`, finalToggleList[name]);
          });
        }
        state.finalToggleList = finalToggleList;
      },
      [allVisitors](path, { finalToggleList }) {
        Object.values(finalToggleList).forEach(data => {
          data.forEach(pos => {
            if (checkPosition(path, pos)) {
              t.removeComments(path.node);
              if (!isNaN(path.key)) {
                path.remove();
              } else {
                adjustNodeAndUpdate(path, pos);
              }
            }
          });
        });
      }
    }
  };
};
