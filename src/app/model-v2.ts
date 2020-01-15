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

export const changePath = createEvent<string>();

const buildOptions = createEffect<string, core.BaseOptions>({
  handler: async cwd => ({ execOptions: { cwd } })
});
const buildedOptions = buildOptions.done.map(({ result }) => result);

const updateLog = createEffect<core.BaseOptions, core.Log>({
  handler: options => core.log(options)
});

const updateRefs = createEffect<core.BaseOptions, core.ShowRef>({
  handler: options => core.showRef(options)
});

forward({ from: $path, to: buildOptions });

forward({ from: buildedOptions, to: [updateLog, updateRefs] });

$path
  .on(changePath, (_, path) => path)
  .watch(path => localStorage.setItem(PATH, path));

$log.on(updateLog.done, (_, { result }) => result);

$refs.on(updateRefs.done, (_, { result }) => result);
