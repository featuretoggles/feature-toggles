const log = () => {};
const checkPosition = (node, togglePos) => {
  log("checkPosition| Node %o |\n toggle positions %o", node.value, togglePos);
  return (
    node.value &&
    togglePos.start <= node.value.start &&
    togglePos.end >= node.value.end
  );
};
export const toggleCommonFunction = j => {
  const restoreCommentForNode = (node, comments = null, process = null) => {
    let { trailingComments, leadingComments } = comments || node;
    if (typeof process === "function") {
      process(trailingComments, leadingComments);
    }
    node.comments = (leadingComments || []).concat(trailingComments || []);
    return node;
  };
  const adjustCommentBeforeRemove = node => {
    const nodeType = node.value.type;
    node.prune();
    if (["JSXAttribute"].indexOf(nodeType) !== -1) {
      const updatedNode =
        node.parentPath.value[node.name] ||
        node.parentPath.value[node.name - 1];
      updatedNode &&
        restoreCommentForNode(updatedNode, null, function(trailingComments) {
          (trailingComments || []).forEach(data => {
            data.trailing = true;
            data.leading = false;
          });
        });
    }
  };
  const adjustNodeAndUpdate = (node, togglePos) => {
    if (
      ["left", "right"].includes(node.name) &&
      !j.AssignmentExpression.check(node.parentPath.value)
    ) {
      if (node.name == "right") {
        node.parentPath.replace(
          restoreCommentForNode(node.parentPath.value["left"], node.value)
        );
      } else if (node.name == "left") {
        node.parentPath.replace(
          restoreCommentForNode(node.parentPath.value["right"], node.value)
        );
      }
    } else if (j.IfStatement.check(node.parentPath.value)) {
      if (checkPosition(node, togglePos)) {
        switch (node.name) {
          case "test":
            if (!node.parentPath.value.alternate) {
              node.parentPath.replace(node.parentPath.value.consequent);
            }
            break;
          case "consequent":
            node.parentPath.replace(node.parentPath.value.alternate);
            break;
          case "alternate":
            node.prune();
            break;
        }
      }
    } else if (["object", "property"].includes(node.name)) {
      if (node.name == "object") {
        node.parentPath.replace(
          restoreCommentForNode(node.parentPath.value["property"], node.value)
        );
      } else if (node.name == "property") {
        if (j.CallExpression.check(node.parentPath.value["object"])) {
          node.parentPath.replace(
            restoreCommentForNode(
              node.parentPath.value["object"].callee,
              node.value
            )
          );
        } else if (j.Identifier.check(node.parentPath.get("object").value)) {
          node.parentPath.parentPath.replace(
            node.parentPath.get("object").value
          );
        }
      }
    } else if (node.name === "superClass") {
      node.prune();
    }
  };

  j.registerMethods({
    getTogglesComment: function(toggleKeys = []) {
      const toggles = this.get().value.tokens.filter(data => {
        return (
          j.Comment.check(data) &&
          toggleKeys.find(d => RegExp(d, "i").test(data.value))
        );
      });
      this._toggleInfo = {
        toggleKeys,
        toggles
      };
      return this;
    },
    getTogglePositions: function(toggleName) {
      const { toggleKeys, toggles } = this._toggleInfo;
      const togglePosition = {};
      toggles.forEach(data => {
        const res = data.value.match(
          new RegExp(`(${toggleKeys.join("|")})\\((.*)\\)`, "i")
        );
        if (res[2] !== toggleName) return;
        togglePosition[res[2]] = togglePosition[res[2]] || [{}];
        if (RegExp(res[1], "i").test(toggleKeys[0])) {
          if (togglePosition[res[2]][togglePosition[res[2]].length - 1].start) {
            togglePosition[res[2]].push({});
          }
          togglePosition[res[2]][togglePosition[res[2]].length - 1].start =
            data.start;
          togglePosition[res[2]][
            togglePosition[res[2]].length - 1
          ].startNode = data;
        } else if (RegExp(res[1], "i").test(toggleKeys[1])) {
          togglePosition[res[2]][togglePosition[res[2]].length - 1].end =
            data.end;
          togglePosition[res[2]][
            togglePosition[res[2]].length - 1
          ].endNode = data;
        }
      });
      this._toggleInfo.togglePosition = togglePosition;
      return this;
    },
    removeToggleSection: function(flag) {
      const { togglePosition } = this._toggleInfo;
      this.find(j.Node).forEach(node => {
        !flag &&
          Object.values(togglePosition).forEach(togglePosValue => {
            togglePosValue.forEach(togglePos => {
              if (checkPosition(node, togglePos)) {
                if (togglePos.visitedOnce && j(node).checkParentTreeIsDeleted())
                  return;
                if (!isNaN(node.name)) {
                  adjustCommentBeforeRemove(node);
                } else {
                  adjustNodeAndUpdate(node, togglePos);
                }
                togglePos.visitedOnce = true;
              }
            });
          });
      });
      return this;
    },
    cleanComments: function() {
      const { togglePosition, toggleKeys } = this._toggleInfo;
      this.find(j.Comment).forEach(node => {
        Object.values(togglePosition).forEach(togglePosValue => {
          togglePosValue.forEach(togglePos => {
            if (checkPosition(node, togglePos)) {
              if (
                RegExp(`(${toggleKeys.join("|")})\\((.*)\\)`, "i").test(
                  node.value.value
                )
              ) {
                node.prune();
              }
            }
          });
        });
      });
      return this;
    },
    cleanEmptyJsxExpression: function() {
      this.find(j.JSXEmptyExpression).forEach(path => {
        if (!(path.get("comments").value || []).length) {
          path.parentPath.prune();
        }
      });
      return this;
    },
    // Check parent tree is deleted or not
    checkParentTreeIsDeleted: function() {
      let path = this.get(0);
      let deleted = false;
      while (path.parentPath) {
        if (path.parentPath.value) {
          path = path.parentPath;
        } else {
          deleted = true;
          break;
        }
      }
      return deleted;
    }
  });
};

export default function transformer(file, api, options) {
  const toggleName = options.toggleName || "feature-3";
  const flag = options.flag;
  const j = api.jscodeshift;
  j.use(toggleCommonFunction);
  const root = j(file.source);
  root
    .getTogglesComment([
      options.commentStart || "toggleStart",
      options.commentEnd || "toggleEnd"
    ])
    .getTogglePositions(toggleName)
    .removeToggleSection(flag)
    .cleanComments()
    .cleanEmptyJsxExpression();
  return root.toSource();
}
