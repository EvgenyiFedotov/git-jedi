import { createStore, forward, createEffect } from "effector";
import { log, logSync, Log, BaseOptions } from "../api-git";
import { $baseOptions } from "./config";

const defaultLog = logSync($baseOptions.getState());

export const $log = createStore<Log>(defaultLog);

const updateLog = createEffect<BaseOptions, Log>({
  handler: options => log(options)
});

forward({ from: $baseOptions, to: updateLog });

$log.on(updateLog.done, (_, { result }) => result);
