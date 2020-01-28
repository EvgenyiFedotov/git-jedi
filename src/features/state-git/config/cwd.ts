import { createStore, createEvent } from "effector";

const PATH_CWD = "CWD";

const defCwd = localStorage.getItem(PATH_CWD) || "./";

export const $cwd = createStore<string>(defCwd);

export const changeCwd = createEvent<string>();

$cwd.on(changeCwd, (_, cwd) => cwd);
$cwd.watch(path => localStorage.setItem(PATH_CWD, path));
