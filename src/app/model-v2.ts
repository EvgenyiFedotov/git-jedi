import { createStore, createEvent, createEffect, forward } from "effector";
import { core } from "../lib/api-git";

const PATH = "PATH";

const defaultPath = localStorage.getItem(PATH) || "./";

export const $log = createStore<core.Log>(new Map());

export const pageMount = createEvent();

const loadLog = createEffect({
  handler: () => core.log({ execOptions: { cwd: defaultPath } })
});

forward({ from: pageMount, to: loadLog });

$log.on(loadLog.done, (_, { result }) => result);
