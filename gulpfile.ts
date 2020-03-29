import chokidar from "chokidar";
import fs from "fs-extra";
import { parallel, series, task } from "gulp";
import nvexeca from "nvexeca";
import which from "which";
import path from "path";

const run = async (
  commands: string,
  cwd?: string,
  opt?: { hideOutput?: boolean; onData?: (e: any) => void }
) => {
  const c = commands.split(" ");
  const app = c.shift() || "";
  const nve = await nvexeca("10", app, c, {
    cwd,
    all: true
  });

  const cmd = nve.childProcess;
  if (cmd && cmd.all && !opt?.hideOutput) {
    cmd.all.pipe(process.stdout);
    if (opt?.onData) {
      cmd.all.on("data", opt.onData);
    }

    await cmd;
  }
};

const yarn = path.resolve("vscode-yarn/yarn/bin/yarn.js");

const download_node_v10 = async (next: any) => {
  await nvexeca("10", "node", ["--version"], { dry: true, process: "inline" });
  next();
};

const prepare_vscode_source = async (next: any) => {
  if (!fs.existsSync("./vscode")) {
    console.log("Cloning from https://github.com/microsoft/vscode ...");
    await run(
      "git clone https://github.com/microsoft/vscode -q --progress --depth 1"
    );
  }
  next();
};

const patch_vscode_source = async (next: any) => {
  if (fs.existsSync("./vscode") && fs.existsSync("./vscode-patch")) {
    await run("cp -r vscode-patch vscode");
  }
  next();
};

const yarn_vscode_source = async (next: any) => {
  if (fs.existsSync("./vscode") && !fs.existsSync("./vscode/node_modules")) {
    await run(`node ${yarn} --non-interactive`, "vscode");
  }
  next();
};

const compile_vscode = async (next: any) => {
  if (fs.existsSync("./vscode") && !fs.existsSync("./vscode/out")) {
    await run(`node ${yarn} compile`, "vscode");
  }
  next();
};

const force_compile_vscode = async (next: any) => {
  if (fs.existsSync("./vscode")) {
    if (fs.existsSync("./vscode/out")) {
      fs.removeSync("./vscode/out");
    }
    await run(`node ${yarn} compile`, "vscode");
    next();
  }
};

async function watch_vscode(next: any) {
  await run("yarn watch", "vscode", {
    onData: e => {
      if (e.toString("utf8").indexOf("with 0 errors after") >= 0) {
        next();
      }
    }
  });
}
run_vscode.displayName = "run_vscode";

async function run_patcher(next: any) {
  chokidar
    .watch("vscode", {
      ignored: [
        "vscode/out**",
        "**/node_modules/**",
        "vscode/.build/**",
        "vscode/src/vs/editor/browser/widget/cactiva/**"
      ],
      disableGlobbing: true
    })
    .on("all", (event, path) => {
      const target = "vscode-patch" + path.substr(6);
      if (event === "unlink") {
        fs.remove(target);
      } else if (event === "change") {
        fs.copy(path, target);
      }
    });

  next();
}
run_patcher.displayName = "run_patcher";

async function run_vscode(next: any) {
  next();
  await run("chmod +x code.sh", "vscode/scripts");
  await run("./code.sh", "vscode/scripts", { hideOutput: true });
}
run_vscode.displayName = "run_vscode";

async function run_fusebox(next: any) {
  next();
  await run("yarn fuse", undefined);
}
run_fusebox.displayName = "run_fusebox";

task("compile", series(compile_vscode));
task("start", parallel(run_vscode, run_fusebox, run_patcher));
task("code", series(run_vscode));
task("vsdev", series(watch_vscode, "start"));
task("force_compile", series(force_compile_vscode));

task(
  "default",
  series(
    download_node_v10,
    prepare_vscode_source,
    patch_vscode_source,
    yarn_vscode_source,
    "compile",
    "start"
  )
);

task("start", parallel(run_vscode, run_fusebox));
