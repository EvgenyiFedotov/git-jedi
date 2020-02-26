import { config as configGit, ConfigOptions } from "lib/api-git";
import { pipeToPromise } from "lib/pipe-to-promise";
import { parseArgs } from "lib/parse-args";

const CORE_EDITOR = "CORE_EDITOR";

export const changeCoreEditor = async (options: ConfigOptions) => {
  const pipe = configGit({ ...options, list: true }).next((config) => {
    const pathEditor = getPathToEditor();
    const coreEditor = config["core.editor"];

    if (coreEditor && coreEditor !== pathEditor) {
      localStorage.setItem(CORE_EDITOR, coreEditor);

      configGit({
        ...options,
        value: ["core.editor", pathEditor],
      });
    }
  });

  await pipeToPromise(pipe);
};

export const backCoreEditor = async (options: ConfigOptions) => {
  const pathEditor = getPathToEditor();
  const coreEditor = localStorage.getItem(CORE_EDITOR);

  if (coreEditor && coreEditor !== pathEditor) {
    const pipe = configGit({
      ...options,
      value: ["core.editor", coreEditor],
    });

    await pipeToPromise(pipe);
  }

  localStorage.removeItem(CORE_EDITOR);
};

function getPathToEditor(): string {
  const appPath = parseArgs(process.argv.slice(2))["--app-path"];
  let path;

  switch (process.platform) {
    case "darwin":
      path = "git-editor-macos";
      break;
    case "linux":
      path = "git-editor-linux";
      break;
    case "win32":
      path = "git-editor-win.exe";
      break;
  }

  return `${appPath}/${path}`;
}
