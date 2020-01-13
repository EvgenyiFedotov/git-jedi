import { createStore, createEvent, forward, createEffect } from "effector";
import { core, layout } from "../lib/git-api";
import { setPreCommand } from "../lib/git-api/core/exec";

const PATH = "PATH";

const defaultPath = localStorage.getItem(PATH) || "./";

setPreCommand(`cd ${defaultPath}`);

export const $path = createStore<string>(defaultPath);
export const $branches = createStore<core.showRef.Refs>(
  layout.showRef.getBranches()
);
export const $log = createStore<core.types.Log>(core.log.get());
export const $showedBranches = createStore<boolean>(false);
export const $currentBranch = createStore<string>(
  core.revParse.getCurrentBranch()
);
export const $refs = createStore<core.showRef.Refs>(core.showRef.get());

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
  from: changePreCommand.done.map(() => layout.showRef.getBranches()),
  to: $branches
});

forward({
  from: changePreCommand.done.map(() => core.log.get()),
  to: $log
});

forward({
  from: changePreCommand.done.map(() => core.revParse.getCurrentBranch()),
  to: $currentBranch
});

forward({
  from: changePreCommand.done.map(() => core.showRef.get()),
  to: $refs
});

forward({
  from: showBranches,
  to: $showedBranches
});
