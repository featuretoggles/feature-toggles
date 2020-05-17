process.env = {};
process.cwd = () => {};
const argv = {
  toggleConfig: "feature-3"
};
const defaultConfig = {
  commentStart: "toggleStart",
  commentEnd: "toggleEnd",
  toggleConfigPath: "toggle-configs",
  customTransformPath: "./ft-transforms"
};

const log = () => {};
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
      const leftNode = node.parent["left"];
      const rightNode = node.parent["right"];

      if (node.key == "right" && leftNode) {
        node.parentPath.replaceWith(leftNode);
        pos.push(true);
      } else if (node.key == "left" && rightNode) {
        if (
          t.isJSXElement(rightNode) &&
          t.isLogicalExpression(node.parentPath)
        ) {
          node.replaceWith(t.BooleanLiteral(true));
          if (node.parent.operator === "||") {
            node.parent.operator = "&&";
          }
        } else {
          node.parentPath.replaceWith(node.parent["right"]);
        }
        pos.push(true);
      }
    } else if (
      t.isIfStatement(node.parentPath) ||
      t.isConditionalExpression(node.parentPath)
    ) {
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
    } else if (node.key === "id") {
      if (t.isVariableDeclarator(node.parent)) {
        if (node.parentPath.parent.declarations.length === 1) {
          node.parentPath.parentPath.remove();
        } else {
          node.parentPath.remove();
        }
        pos.push(true);
      }
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
        log(
          "List of selected toggle config: '%s' and its flags: %o",
          defaultToggle,
          toggles
        );
      } else {
        // throw new Error(
        //   "Failed - Looks like you are not provided 'toggleConfig' file path. \n Try using '--toggleConfig=<config file name>'"
        // );
      }
      const listToggleName = {};
      const finalToggleList = {};
      state.ast.comments.forEach(data => {
        if (data.value.indexOf(inFileConfig) !== -1) {
          try {
            const overrideFeatureNames =
              JSON.parse(
                data.value.replace(inFileConfig, "").replace(/\/n/, "")
              ) || {};
            toggles = {
              ...toggles,
              ...overrideFeatureNames
            };
          } catch (error) {
            throw Error(
              `Looks like you missed something in file config ${data.value}`
            );
          }
        }
        const commentStartRegex = new RegExp(
          `^\\s?${this.opts.commentStart}\\((.*)\\)`,
          "i"
        );
        const commentEndRegex = new RegExp(
          `^\\s?${this.opts.commentEnd}\\((.*)\\)`,
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
      this.finalToggleList = finalToggleList;
    },
    visitor: {
      Program: {
        enter(path, { finalToggleList }) {
          path.traverse({
            [allVisitors](path) {
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
          });
        }
      }
    },
    post() {
      const validate = Object.values(this.finalToggleList)
        .map(data => {
          return data.every(pos => {
            if (!pos[0]) {
              const filterRes = Object.values(this.finalToggleList)
                .reduce((data, next) => data.concat(next), [])
                .filter(data => data[0] < pos[0] && data[1] > pos[1]);
              if (filterRes[0] && filterRes[0][2]) {
                return true;
              }
            } else {
              return true;
            }
          });
        })
        .every(data => data);
      if (!validate) {
        log("Missing flags %o", this.finalToggleList);
        throw new Error(
          `Feature toggling failed. \nLooks like problem with ${packages.name}. Please create a issue ${packages.bugs.url}`
        );
      }
    }
  };
};
