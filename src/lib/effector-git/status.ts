import {
  createStore,
  createEffect,
  createEvent,
  guard,
  forward
} from "effector";
import { status, statusSync, stash, StatusPath, add, reset } from "../api-git";
import { $baseOptions } from "./config";
import { committing } from "features/log/model";

const defaultStatus = statusSync($baseOptions.getState());

const getStageChanges = (): StatusPath[] => {
  return $status.getState().filter(status => {
    return !!status.stagedStatus && status.stagedStatus !== "untracked";
  });
};

const getChanges = (): StatusPath[] => {
  return $status.getState().filter(status => {
    return !!status.status;
  });
};

export const $status = createStore<StatusPath[]>(defaultStatus);
export const $isChanged = createStore<boolean>(!!defaultStatus.length);
export const $discarding = createStore<Set<string>>(new Set());
export const $stageChanges = createStore<StatusPath[]>(getStageChanges());
export const $changes = createStore<StatusPath[]>(getChanges());

export const discardChanges = createEvent<string>();
export const stageChanges = createEvent<string>();
export const unstageChanges = createEvent<string>();
export const stageChangesAll = createEvent();
export const unstageChangesAll = createEvent();

const updateStatus = createEffect<void, StatusPath[]>({
  handler: () => {
    return status($baseOptions.getState());
  }
});

const stashPush = createEffect<string, string>({
  handler: async path => {
    return stash({ paths: [path], ...$baseOptions.getState() });
  }
});

const stashDrop = createEffect<void, string>({
  handler: async () => {
    return stash({ action: "drop", ...$baseOptions.getState() });
  }
});

const addPath = createEffect<string, string>({
  handler: async path => {
    return add({ paths: [path], ...$baseOptions.getState() });
  }
});

const resetByPath = createEffect<string, string>({
  handler: async path => {
    return reset({ paths: [path], ...$baseOptions.getState() });
  }
});

const addAll = createEffect<void, string>({
  handler: async () => {
    return add({ ...$baseOptions.getState() });
  }
});

const resetAll = createEffect<void, string>({
  handler: async path => {
    return reset({ ...$baseOptions.getState() });
  }
});

const guardDiscardChanges = guard({
  source: discardChanges,
  filter: path => !!path && !$discarding.getState().has(path)
});

forward({ from: $baseOptions, to: updateStatus });

forward({ from: guardDiscardChanges, to: stashPush });
forward({ from: stashPush.done, to: stashDrop });
forward({ from: stashDrop, to: updateStatus });

forward({ from: stageChanges, to: addPath });
forward({ from: addPath.done, to: updateStatus });

forward({ from: unstageChanges, to: resetByPath });
forward({ from: resetByPath.done, to: updateStatus });

forward({ from: stageChangesAll, to: addAll });
forward({ from: addAll.done, to: updateStatus });

forward({ from: unstageChangesAll, to: resetAll });
forward({ from: resetAll.done, to: updateStatus });

forward({ from: committing.done, to: updateStatus });

$status.on(updateStatus.done, (_, { result }) => result);

$discarding.on(guardDiscardChanges, (store, path) => {
  return path ? new Set([...store, path]) : store;
});
$discarding.on(stashDrop.done, (store, { result }) => {
  if (result && store.has(result)) {
    store.delete(result);
    return new Set([...store]);
  }
  return store;
});

$isChanged.on($status, (_, status) => !!status.length);

$stageChanges.on($status, () => getStageChanges());

$changes.on($status, () => getChanges());
