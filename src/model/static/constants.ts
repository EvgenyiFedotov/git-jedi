import { parseArgs } from "lib/parse-args";

export const PATH_APP = parseArgs(process.argv.slice(2))["--app-path"];

export const PATH_SETTINGS = `${PATH_APP}/settings.json`;

export const PATH_GIT_EDITOR_MESSAGE = `${PATH_APP}/GIT_EDITOR_MESSAGE`;

export const PATH_CACHE = `${PATH_APP}/CACHE`;

export const PATH_GIT_EDITOR = (() => {
  switch (process.platform) {
    case "darwin":
      return `${PATH_APP}/git-editor-macos`;
    case "linux":
      return `${PATH_APP}/git-editor-linux`;
    case "win32":
      return `${PATH_APP}/git-editor-win.exe`;
    default:
      return "";
  }
})();
