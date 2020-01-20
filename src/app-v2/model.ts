import {
  createStore,
  createEvent,
  createEffect,
  forward,
  guard
} from "effector";
import * as core from "../lib/api-git";

const PATH = "PATH";

const defaultPath = localStorage.getItem(PATH) || "./";
export const $path = createStore(defaultPath);

const defaultOptions = { execOptions: { cwd: defaultPath } };

const defaultLog = core.logSync(defaultOptions);
export const $log = createStore(defaultLog);

const defaultRefs = core.showRefSync(defaultOptions);
export const $refs = createStore(defaultRefs);

// const getBranches = (showRef: core.ShowRef): core.Refs => {
//   const { refs } = showRef;
//   const values = Array.from(refs.values());

//   return values.reduce((memo, ref) => {
//     if (ref.type === "heads") {
//       memo.set(ref.name, ref);
//     }

//     return memo;
//   }, new Map());
// };
// const defaultBranches = getBranches($refs.getState());
// export const $branches = createStore(defaultBranches);

const defaultCurrentBranch = core.revParseSync(defaultOptions);
export const $currentBranch = createStore(defaultCurrentBranch);

const defaultStatus = core.statusSync(defaultOptions);
export const $status = createStore(defaultStatus);
export const $isChanged = createStore<boolean>(!!defaultStatus.length);
export const $discarding = createStore<Set<string>>(new Set());

const getStageChanges = (): core.StatusPath[] => {
  return $status.getState().filter(status => {
    return !!status.stagedStatus && status.stagedStatus !== "untracked";
  });
};
export const $stageChanges = createStore<core.StatusPath[]>(getStageChanges());

const getChanges = (): core.StatusPath[] => {
  return $status.getState().filter(status => {
    return !!status.status;
  });
};
export const $changes = createStore<core.StatusPath[]>(getChanges());

export const changePath = createEvent<string>();
export const changeBranch = createEvent<string>();
export const discardChanges = createEvent<string | null>();

const updateLog = createEffect<string, core.Log>({
  handler: cwd => core.log({ execOptions: { cwd } })
});

// const updateRefs = createEffect<string, core.ShowRef>({
//   handler: cwd => core.showRef({ execOptions: { cwd } })
// });

const updateCurrentBranch = createEffect<string, string>({
  handler: cwd => core.revParse({ execOptions: { cwd } })
});

const updateStatus = createEffect<string, core.StatusPath[]>({
  handler: cwd => core.status({ execOptions: { cwd } })
});

const checkoutBranch = createEffect<string, string>({
  handler: async branch => {
    if ($isChanged.getState() === false) {
      const cwd = $path.getState();

      return core.checkout({ branch, execOptions: { cwd } });
    }

    throw new Error("Files changed");
  }
});

const stashPush = createEffect<string | null, string | null>({
  handler: async path => {
    const cwd = $path.getState();
    return core
      .stash({ paths: path ? [path] : [], execOptions: { cwd } })
      .then(() => path);
  }
});

const stashDrop = createEffect<string | null, string | null>({
  handler: async path => {
    const cwd = $path.getState();
    return core
      .stash({ action: "drop", execOptions: { cwd } })
      .then(() => path);
  }
});

const guardDiscardChanges = guard({
  source: discardChanges,
  filter: path => !!path && !$discarding.getState().has(path)
});

// forward({
//   from: $path,
//   to: [updateLog, updateRefs, updateCurrentBranch, updateStatus]
// });

// forward({ from: changeBranch, to: checkoutBranch });

// forward({
//   from: checkoutBranch.done.map(() => $path.getState()),
//   to: [updateLog, updateRefs, updateCurrentBranch, updateStatus]
// });

forward({ from: guardDiscardChanges, to: stashPush });

forward({ from: stashPush.done.map(({ result }) => result), to: stashDrop });

forward({ from: stashDrop.done.map(() => $path.getState()), to: updateStatus });

$path
  .on(changePath, (_, path) => path)
  .watch(path => localStorage.setItem(PATH, path));

$log.on(updateLog.done, (_, { result }) => result);

// $refs.on(updateRefs.done, (_, { result }) => result);

$currentBranch.on(updateCurrentBranch.done, (_, { result }) => result);

$status.on(updateStatus.done, (_, { result }) => result);

$isChanged.on($status, (_, status) => !!status.length);

// $branches.on($refs, (_, showRef) => getBranches(showRef));

$stageChanges.on($status, () => getStageChanges());

$changes.on($status, () => getChanges());

stashDrop.done.watch(() => console.log("stashDrop done"));
stashDrop.fail.watch(e => console.log("stashDrop fail", e));

$discarding
  .on(guardDiscardChanges, (store, path) => {
    return path ? new Set([...store, path]) : store;
  })
  .on(stashDrop.done, (store, { result }) => {
    if (result && store.has(result)) {
      store.delete(result);
      return new Set([...store]);
    }
    return store;
  });
