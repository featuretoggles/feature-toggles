export default function transformer(file, api, options) {
  const toggleName = options.toggleName;
  const flag = options.flag;
  const j = api.jscodeshift;
  const adjustNodeAndUpdate = node => {
    if (
      ["left", "right"].includes(node.name) &&
      !j.AssignmentExpression.check(node.parentPath.value)
    ) {
      if (node.name == "right") {
        node.parentPath.replace(node.parentPath.value["left"]);
      } else if (node.name == "left") {
        node.parentPath.replace(node.parentPath.value["right"]);
      }
    } else if (j.IfStatement.check(node.parentPath.value)) {
      if (node.name === "alternate") {
        node.replace(null);
      }
    } else if (["object", "property"].includes(node.name)) {
      if (node.name == "object") {
        node.parentPath.replace(node.parentPath.value["property"]);
      } else if (node.name == "property") {
        if (j.CallExpression.check(node.parentPath.value["object"])) {
          node.parentPath.replace(node.parentPath.value["object"].callee);
        }
      }
    }
  };
  j.registerMethods({
    getTogglesComment: function(toggleKeys = []) {
      const toggles = this.get().value.tokens.filter(data => {
        return (
          j.Comment.check(data) && toggleKeys.find(d => data.value.includes(d))
        );
      });
      this._toggleInfo = {
        toggleKeys,
        toggles
      };
      return this;
    },
    getTogglePositions: function() {
      const { toggleKeys, toggles } = this._toggleInfo;
      const togglePosition = {};
      toggles.forEach(data => {
        const res = data.value.match(
          new RegExp(`(${toggleKeys.join("|")})\\((.*)\\)`)
        );
        if (res[2] !== toggleName) return;
        togglePosition[res[2]] = togglePosition[res[2]] || [{}];
        if (res[1] === toggleKeys[0]) {
          if (togglePosition[res[2]][togglePosition[res[2]].length - 1].start) {
            togglePosition[res[2]].push({});
          }
          togglePosition[res[2]][togglePosition[res[2]].length - 1].start =
            data.start;
          togglePosition[res[2]][
            togglePosition[res[2]].length - 1
          ].startNode = data;
        } else if (res[1] === toggleKeys[1]) {
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
    removeToggleSection: function() {
      const { togglePosition } = this._toggleInfo;
      this.find(j.Node).forEach(node => {
        !flag &&
          Object.values(togglePosition).forEach(togglePosValue => {
            togglePosValue.forEach(togglePos => {
              if (
                node.value &&
                togglePos.start <= node.value.start &&
                togglePos.end >= node.value.end
              ) {
                if (!isNaN(node.name)) {
                  node.replace();
                } else {
                  adjustNodeAndUpdate(node, togglePos);
                }
              }
            });
          });
      });
      this.find(j.Comment).forEach(node => {
        Object.values(togglePosition).forEach(togglePosValue => {
          togglePosValue.forEach(togglePos => {
            if (
              node.value &&
              togglePos.start <= node.value.start &&
              togglePos.end >= node.value.end
            ) {
              node.replace();
            }
          });
        });
      });
      return this;
    }
  });

  const root = j(file.source);
  root
    .getTogglesComment(["toggleStart", "toggleEnd"])
    .getTogglePositions()
    .removeToggleSection();
  return root.toSource();
}
