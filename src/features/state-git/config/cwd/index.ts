import { createStore, createEvent, createEffect, forward } from "effector";

import { initStateGit } from "../../events";

export const PATH_CWD = "CWD";

export const $cwd = createStore<string>("./");

export const changeCwd = createEvent<string>();

export const getCwdFromLocalStorage = createEffect<void, string>({
  handler: async () => localStorage.getItem(PATH_CWD) || "./",
});

export const setCwdToLocalStorage = createEffect<string, void>({
  handler: async (path) => {
    localStorage.setItem(PATH_CWD, path);
  },
});

forward({
  from: initStateGit,
  to: getCwdFromLocalStorage,
});
forward({
  from: getCwdFromLocalStorage.done.map(({ result }) => result),
  to: changeCwd,
});
forward({
  from: changeCwd,
  to: setCwdToLocalStorage,
});

$cwd.on(changeCwd, (_, cwd) => cwd);
