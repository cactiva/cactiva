const path = require("path");
const WebpackShellPlugin = require("webpack-shell-plugin");
const patchDir = path.resolve(
  __dirname,
  "../vscode-patch/src/vs/editor/browser/widget/cactiva/"
);
const targetDir = path.resolve(
  __dirname,
  "../vscode/src/vs/editor/browser/widget/cactiva/"
);

const outDir = path.resolve(
  __dirname,
  "../vscode/out/vs/editor/browser/widget/cactiva/"
);
module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    filename: "cactiva-worker.txt",
    path: patchDir
  },
  plugins: [
    new WebpackShellPlugin({
      dev: false,
      onBuildEnd: [
        `cp -rf ${patchDir}/cactiva-worker.txt ${targetDir}`,
        `cp -rf ${patchDir}/cactiva-worker.txt ${outDir}`,
        `echo "Build end"`
      ]
    })
  ]
};
