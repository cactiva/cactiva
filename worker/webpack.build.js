const path = require("path");

module.exports = {
  entry: "./src/index.js",
  mode: "production",
  output: {
    filename: "cactiva-worker.txt",
    path: path.resolve(
      __dirname,
      "../vscode-patch/src/vs/editor/browser/widget/cactiva/"
    )
  }
};
