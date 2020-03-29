import * as fs from "fs";
import { fusebox, sparky } from "fuse-box";

class Context {
  getConfig = () =>
    fusebox({
      sourceMap: false,
      target: "browser",
      hmr: { plugin: "src/hmr.ts" },
      entry: "src/index.tsx",
      devServer: {
        hmrServer: {
          connectionURL: "ws://localhost:4444"
        }
      },
      cache: true
    });
}
const { task } = sparky<Context>(Context);

task("default", async ctx => {
  const fuse = ctx.getConfig();
  const response = await fuse.runDev({
    bundles: {
      distRoot: "./vscode/src/vs/editor/browser/widget/cactiva",
      app: "cactiva-app.js"
    }
  });

  response.onWatch(() => {
    const appDir = "./vscode/src/vs/editor/browser/widget/cactiva/";
    fs.readFile(appDir + "cactiva-app.js", "utf8", function(err, data) {
      if (err) {
        return console.log(err);
      }
      var result = data.replace(
        "__fuse.bundle({",
        `
			define(["require", "exports"], function(require, exports) {

				Object.defineProperty(exports, "__esModule", { value: true });
				exports.default = __fuse.c[1].m.exports;
			});
			__fuse.bundle({`
      );

      fs.writeFile(appDir + "cactiva-app.js", result, "utf8", function(err) {
        if (err) return console.log(err);
      });
      fs.writeFile(
        appDir + "cactiva-app.d.ts",
        `declare module 'vs/editor/browser/widget/cactiva/cactiva-app';`,
        "utf8",
        function(err) {
          if (err) return console.log(err);
        }
      );
    });
  });
});
