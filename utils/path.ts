const path = require("path");

export const rootDir: string = path
  .dirname(require.main?.filename)
  .replace(/(\/dist)$/, "");
