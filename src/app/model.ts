import { createStore, createEvent, forward, createEffect } from "effector";
import { core } from "../lib/git-api";
import { setPreCommand } from "../lib/git-api/core/exec";

const PATH = "PATH";

const defaultPath = localStorage.getItem(PATH) || "./";

setPreCommand(`cd ${defaultPath}`);

export const $path = createStore<string>(defaultPath);
export const $branches = createStore<core.types.Branch[]>(core.branch.getAll());
export const $log = createStore<core.types.Log>(core.log.get());
export const $showedBranches = createStore<boolean>(false);

export const changePath = createEvent<string>();
export const showBranches = createEvent<boolean>();

const changePreCommand = createEffect<string, void>({
  handler: async path => {
    setPreCommand(`cd ${path}`);
    localStorage.setItem(PATH, path);
  }
});

forward({
  from: changePath,
  to: [$path, changePreCommand]
});

forward({
  from: changePreCommand.done.map(() => core.branch.getAll()),
  to: $branches
});

forward({
  from: changePreCommand.done.map(() => core.log.get()),
  to: $log
});

forward({
  from: showBranches,
  to: $showedBranches
});
