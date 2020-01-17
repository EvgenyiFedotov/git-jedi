import { createStore, createEvent } from "effector";
import { BaseOptions } from "../api-git";

const CWD = "CWD";

const defaultPath = localStorage.getItem(CWD) || "./";

export const $cwd = createStore<string>(defaultPath);
export const $baseOptions = createStore<BaseOptions>({
  execOptions: { cwd: $cwd.getState() }
});

export const changePath = createEvent<string>();

$cwd
  .on(changePath, (_, path) => path)
  .watch(path => localStorage.setItem(CWD, path));

$baseOptions.on($cwd, (_, cwd) => ({ execOptions: { cwd } }));
