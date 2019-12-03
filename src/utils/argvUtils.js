export const getArgv = argv => {
  const final = {};
  argv.forEach(data => {
    if (data.indexOf("--") !== -1) {
      const res = data.replace("--", "").split("=");
      final[res[0]] = res[1] || !res[1];
    }
  });
  return final;
};

export const argv = getArgv(process.argv);
