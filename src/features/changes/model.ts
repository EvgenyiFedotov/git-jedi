import {
  createEvent,
  createStore,
  sample,
  guard,
  combine,
  Store,
} from "effector";
import {
  createCommit as createCommitGitV2,
  commit,
  stage,
  $stagedChanges,
  $unstagedChanges,
} from "features/state-git";
import { MessageFormatted, toMessage, ChangeLine } from "lib/api-git";
import { getScopePath } from "lib/scope-path";

export const $isShowChanges = createStore<boolean>(true);
export const $commitFormValue = createStore<MessageFormatted>({
  type: "feat",
  note: "",
  scope: "",
});

export const createCommit = createEvent<void>();
export const toggleIsShowChanges = createEvent<any>();
export const changeCommitFormValue = createEvent<MessageFormatted>();

sample({
  source: $commitFormValue,
  clock: createCommit,
  fn: (commit) => toMessage(commit),
  target: createCommitGitV2,
});

const autoStagePaths = sample({
  source: combine([$stagedChanges, $unstagedChanges]),
  clock: $commitFormValue,
  fn: ([stagedChanges, unstagedChanges], { scope }) => {
    if (!stagedChanges.length && !!scope) {
      // TODO Use config (scope-root)
      const scopeRoot = "src/";

      return unstagedChanges
        .map((change) => change.path)
        .filter((path) => {
          return !!path.match(new RegExp(`^${scopeRoot}${scope}`));
        });
    }

    return [];
  },
});

guard({
  source: autoStagePaths,
  filter: (paths) => !!paths.length,
  target: stage,
});

$isShowChanges.on(toggleIsShowChanges, (prev) => !prev);

$commitFormValue.on(changeCommitFormValue, (_, value) => value);
$commitFormValue.on(commit.done, () => ({
  type: "feat",
  note: "",
  scope: "",
}));
$commitFormValue.on(stage, (store, paths) => {
  if (store.scope) {
    return store;
  }

  // TODO Use config (scope-root)
  const scopeRoot = "src/";

  return { ...store, scope: getScopePath(paths[0], scopeRoot) };
});
