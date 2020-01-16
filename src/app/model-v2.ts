import { createStore, createEvent, createEffect, forward } from "effector";
import { core } from "../lib/api-git";

const PATH = "PATH";

const defaultPath = localStorage.getItem(PATH) || "./";
export const $path = createStore(defaultPath);

const defaultOptions = { execOptions: { cwd: defaultPath } };

const defaultLog = core.logSync(defaultOptions);
export const $log = createStore(defaultLog);

const defaultRefs = core.showRefSync(defaultOptions);
export const $refs = createStore(defaultRefs);

const defaultCurrentBranch = core.revParseSync(defaultOptions);
export const $currentBranch = createStore(defaultCurrentBranch);

const defaultStatus = core.statusSync(defaultOptions);
export const $status = createStore(defaultStatus);
export const $isChanged = createStore<boolean>(!!defaultStatus.length);

export const changePath = createEvent<string>();

const updateLog = createEffect<string, core.Log>({
  handler: cwd => core.log({ execOptions: { cwd } })
});

const updateRefs = createEffect<string, core.ShowRef>({
  handler: cwd => core.showRef({ execOptions: { cwd } })
});

const updateCurrentBranch = createEffect<string, string>({
  handler: cwd => core.revParse({ execOptions: { cwd } })
});

const updateStatus = createEffect<string, core.StatusPath[]>({
  handler: cwd => core.status({ execOptions: { cwd } })
});

forward({
  from: $path,
  to: [updateLog, updateRefs, updateCurrentBranch, updateStatus]
});

$path
  .on(changePath, (_, path) => path)
  .watch(path => localStorage.setItem(PATH, path));

$log.on(updateLog.done, (_, { result }) => result);

$refs.on(updateRefs.done, (_, { result }) => result);

$currentBranch.on(updateCurrentBranch.done, (_, { result }) => result);

$status.on(updateStatus.done, (_, { result }) => result);

$isChanged.on($status, (_, status) => !!status.length);
