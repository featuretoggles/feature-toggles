import debug from "debug";
import { getToggles } from "./utils/getTogglesInfo";

const log = debug("feature-toggles:babel-plugin");
export default (babel, options) => {
  const { types: t } = babel;
  const dir = process.env.TOGGLE_DIR || options.dir || process.cwd();
  const defaultToggle = process.env.TOGGLE_NAME || options.toggleName;
  const allVisitors = Object.keys(t.VISITOR_KEYS)
    .filter(data => data !== "Program")
    .join("|");
  const togglesList = getToggles(dir);
  const toggles = togglesList[defaultToggle];
  const listToggleName = {};
  const finalToggleList = {};
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
      [allVisitors](path, state) {
        Object.values(finalToggleList).forEach(data => {
          data.forEach(pos => {
            if (
              path.node &&
              pos[0] <= path.node.start &&
              pos[1] >= path.node.end
            ) {
              path.remove();
            }
          });
        });
      }
    }
  };
};
