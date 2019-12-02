import path from "path";
import { argv } from "yargs";
import reqAll from "./requireAll";

const TOGGLE_PATH = "./feature-toggles";
export const getTheNameWithOutExtension = fileName => fileName.split(".")[0];
export const getTheToggleFolder = () =>
  process.env.TOGGLE_PATH || argv.togglePath || TOGGLE_PATH;
export const listTogglesByFileName = (dir = __dirname) => {
  const listOfToggleConfig = reqAll({
    dirPath: dir
      ? path.resolve(dir, getTheToggleFolder())
      : getTheToggleFolder(),
    fileNameMap: getTheNameWithOutExtension
  });
  return listOfToggleConfig;
};
export const getToggleNameDetails = name => {
  const isNegative = name.indexOf("!") !== -1;
  return {
    name: name.replace(/^!/, ""),
    opposite: isNegative
  };
};
export const showOrHideFlag = (data, type = true) => {
  const map = {};
  if (Array.isArray(data)) {
    data.forEach(toggleName => {
      const { name, opposite } = getToggleNameDetails(toggleName);
      map[name] = opposite ? !type : type;
    });
  }
  return map;
};
export const createToggleObject = listOfToggleConfig => {
  const listOfTogglesByTeam = {};
  const toggleFileNameKeys = Object.keys(listOfToggleConfig);
  toggleFileNameKeys.forEach(keyName => {
    listOfTogglesByTeam[keyName] = {};
    toggleFileNameKeys.forEach(key => {
      if (key !== keyName) {
        listOfTogglesByTeam[keyName] = {
          ...listOfTogglesByTeam[keyName],
          ...showOrHideFlag(listOfToggleConfig[key], false)
        };
      }
    });
    listOfTogglesByTeam[keyName] = {
      ...listOfTogglesByTeam[keyName],
      ...showOrHideFlag(listOfToggleConfig[keyName])
    };
  });
  return listOfTogglesByTeam;
};
export const getToggles = (dir = __dirname) => {
  const listOfToggleConfig = listTogglesByFileName(dir);
  return createToggleObject(listOfToggleConfig);
};
