import chokidar from "chokidar";
import fs from "fs-extra";
import { parallel, series, task } from "gulp";
import nvexeca from "nvexeca";
import execa from "execa";
import ora from "ora";
import path from "path";

const runExeca = async (
  commands: string,
  cwd?: string,
  opt?: { hideOutput?: boolean; onData?: (e: any) => void }
) => {
  const c = commands.split(" ");
  const app = c.shift() || "";
  const cmd = execa(app, c, {
    cwd,
    all: true
  });

  if (cmd && cmd.all && !opt?.hideOutput) {
    cmd.all.pipe(process.stdout);
    if (opt?.onData) {
      cmd.all.on("data", opt.onData);
    }
  }

  if (opt?.hideOutput) {
    const spinner = ora("Loading...").start();
    cmd.all.on("data", e => {
      spinner.text = e.toString("utf8");
    });
    await cmd;
    spinner.stop();
  } else {
    await cmd;
  }
};

const run = async (
  commands: string,
  cwd?: string,
  opt?: { hideOutput?: boolean; loading?: boolean; onData?: (e: any) => void }
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
  }

  if (opt?.hideOutput && opt?.loading !== false) {
    const spinner = ora("Loading...").start();
    cmd.all.on("data", e => {
      spinner.text = e.toString("utf8");
    });
    await cmd;
    spinner.stop();
  } else {
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
    await fs.copy("vscode-patch", "vscode");
  }

  if (
    fs.existsSync("./vscode/src/vs/editor/browser/widget/cactiva") &&
    fs.existsSync("./vscode/out/vs/editor/browser/widget/cactiva")
  ) {
    await fs.copy(
      "vscode/src/vs/editor/browser/widget/cactiva",
      "vscode/out/vs/editor/browser/widget/cactiva"
    );
  }

  next();
};

const yarn_vscode_source = async (next: any) => {
  if (fs.existsSync("./vscode") && !fs.existsSync("./vscode/node_modules")) {
    // loading spinner
    await run(`node ${yarn} --non-interactive`, "vscode", {
      hideOutput: true
    });
  }
  next();
};

const compile_vscode = async (next: any) => {
  if (!fs.existsSync("./vscode-patch/src/vs/editor/browser/widget/cactiva")) {
    run_app();
    await build_worker();
  }
  if (fs.existsSync("./vscode") && !fs.existsSync("./vscode/out/main.js")) {
    await run(`node ${yarn} compile`, "vscode", {
      hideOutput: true
    });
  }
  next();
};

const force_compile_vscode = async (next: any) => {
  if (fs.existsSync("./vscode")) {
    if (fs.existsSync("./vscode/out")) {
      fs.removeSync("./vscode/out");
    }
    await run(`node ${yarn} compile`, "vscode", {
      hideOutput: true
    });
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

async function run_patcher() {
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
}
run_patcher.displayName = "run_patcher";

async function run_vscode() {
  await run("chmod +x code.sh", "vscode/scripts");
  await run("./code.sh", "vscode/scripts", {
    hideOutput: true,
    loading: false
  });
}
run_vscode.displayName = "run_vscode";

let is_app_running = false;
async function run_app(next?: any) {
  if (!is_app_running) {
    await runExeca("ts-node -T run-app");
    is_app_running = true;
  }

  if (next) next();
}
run_app.displayName = "run_app";

async function run_worker() {
  await runExeca("yarn", "worker");
  await runExeca("yarn dev", "worker");
}
run_worker.displayName = "run_worker";

async function build_worker() {
  await runExeca("yarn", "worker");
  await runExeca("yarn build", "worker");
}
build_worker.displayName = "build_worker";

async function start(next: any) {
  run_app();
  run_worker();
  run_vscode();
  next();
}

task("compile", series(compile_vscode));
task("code", series(run_vscode));
task("patch", series(run_patcher));
task("start", series(start));
task("app", series(run_app));
task("worker", series(run_worker));
task("worker-build", series(build_worker));
task("watch", parallel(run_patcher, watch_vscode));
task("force_compile", series(force_compile_vscode));

task(
  "default",
  series(
    download_node_v10,
    prepare_vscode_source,
    patch_vscode_source,
    yarn_vscode_source,
    compile_vscode,
    start
  )
);
