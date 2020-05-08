import debug from "debug";
import { getToggles, getTheToggleFolder } from "./utils/getTogglesInfo";
import { argv } from "./utils/argvUtils";
import defaultConfig from "./defaultConfig";
import finder from "find-package-json";

let packages = finder(__dirname).next().value;
const log = debug("feature-toggles:babel-plugin");

export default babel => {
  const { types: t } = babel;
  const inFileConfig = "featureTogglesConfig:";
  const allVisitors = Object.keys(t.VISITOR_KEYS)
    .filter(data => data !== "Program")
    .join("|");

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
        pos.push(true);
      } else if (node.key == "left" && node.parent["right"]) {
        node.parentPath.replaceWith(node.parent["right"]);
        pos.push(true);
      }
    } else if (t.isIfStatement(node.parentPath)) {
      if (checkPosition(node, pos)) {
        switch (node.key) {
          case "test":
            if (!node.parent.alternate) {
              node.parentPath.replaceWith(node.parent.consequent);
              pos.push(true);
            }
            break;
          case "consequent":
            node.parentPath.replaceWith(node.parent.alternate);
            pos.push(true);
            break;
          case "alternate":
            node.remove();
            pos.push(true);
            break;
        }
      }
    } else if (["object", "property"].includes(node.key)) {
      if (node.key == "object") {
        if (node.parent["property"].node) {
          node.parentPath.replaceWith(node.parent["property"]);
          pos.push(true);
        }
      } else if (node.key == "property") {
        if (node.parent["object"]) {
          if (t.isCallExpression(node.parent["object"])) {
            node.parentPath.replaceWith(node.parent["object"].callee);
            pos.push(true);
          } else {
            node.parentPath.parentPath.replaceWith(node.parent["object"]);
            pos.push(true);
          }
        }
      }
    } else if (node.key === "superClass") {
      node.remove();
      pos.push(true);
    }
  };
  return {
    name: "feature-toggles",
    pre(state) {
      this.opts = {
        ...defaultConfig,
        ...this.opts
      };
      const dir =
        process.env.TOGGLE_DIR ||
        argv.toggleDir ||
        this.opts.dir ||
        process.cwd();
      const defaultToggle =
        process.env.TOGGLE_CONFIG_NAME ||
        argv.toggleConfig ||
        this.opts.toggleConfig;

      let togglesList = {};
      let toggles = {};
      if (dir && defaultToggle) {
        togglesList = getToggles(getTheToggleFolder(dir, this.opts));
        toggles = togglesList[defaultToggle];
      } else {
        throw new Error(
          "Failed - Looks like you are not provided 'toggleConfig' file path. \n Try using '--toggleConfig=<config file name>'"
        );
      }
      this.toggles = toggles;
    },
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
              state.toggles = {
                ...state.toggles,
                ...overrideFeatureNames
              };
            } catch (error) {
              throw Error(
                `Looks like you missed something in file config ${data.value}`
              );
            }
          }
          const toggles = state.toggles;
          const commentStartRegex = new RegExp(
            `^\\s?${state.opts.commentStart}\\((.*)\\)`,
            "i"
          );
          const commentEndRegex = new RegExp(
            `^\\s?${state.opts.commentEnd}\\((.*)\\)`,
            "i"
          );
          const trimmedComment = data.value.replace(/ /g, "");
          if (commentStartRegex.test(trimmedComment)) {
            const res = trimmedComment.match(commentStartRegex);
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
          } else if (commentEndRegex.test(trimmedComment)) {
            const res = trimmedComment.match(commentEndRegex);
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
                pos.push(true);
              } else {
                adjustNodeAndUpdate(path, pos);
              }
            }
          });
        });
      }
    },
    post() {
      const validate = Object.values(this.finalToggleList)
        .map(data => {
          return data.every(pos => pos[2]);
        })
        .every(data => data);
      if (!validate) {
        throw new Error(
          `Feature toggling failed. \nLooks like problem with ${packages.name}. Please create a issue ${packages.bugs.url}`
        );
      }
    }
  };
};
