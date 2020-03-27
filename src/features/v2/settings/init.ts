import * as ef from "effector";
import { showSelectCwdDialog } from "features/v2/path-repo/model";

import * as model from "./model";

const setupDefaultSettings = ef.guard({
  source: model.readSettings.done,
  filter: ({ result }) => !result,
});

ef.forward({
  from: model.initSettings,
  to: model.readSettings,
});

ef.sample({
  source: model.$settings,
  clock: setupDefaultSettings,
  target: model.writeSettings,
});

const changeCwdAfterSelect = ef.sample({
  source: model.$cwd,
  clock: showSelectCwdDialog.done,
  fn: (store, { result }) => ({
    store,
    next: result.filePaths[0] || store || null,
  }),
});

ef.forward({
  from: changeCwdAfterSelect.map(({ next }) => next),
  to: model.$cwd,
});

ef.guard({
  source: changeCwdAfterSelect,
  filter: ({ store, next }) => store !== next,
  target: model.changedCwd.prepend(
    ({ next }: { store: string | null; next: string | null }) => next,
  ),
});

ef.forward({
  from: model.$settings,
  to: model.writeSettings,
});

// Add, remove commit types
ef.sample({
  source: ef.combine([model.$newCommitType, model.$commitTypes]),
  clock: model.addNewCommitType,
  fn: ([newType, commitTypes]) => {
    const index = commitTypes.indexOf(newType);

    if (index === -1) {
      return [...commitTypes, newType];
    }

    return commitTypes;
  },
  target: model.$commitTypes,
});

ef.sample({
  source: model.$commitTypes,
  clock: model.removeCommitType,
  fn: (commitTypes, removeType) => {
    const index = commitTypes.indexOf(removeType);

    if (index === -1) {
      return commitTypes;
    }

    const next = [...commitTypes];

    next.splice(index, 1);

    return next;
  },
  target: model.$commitTypes,
});

model.$newCommitType.on(model.$commitTypes, () => "");

// Setup default item settings

ef.sample({
  source: model.$cwd,
  clock: model.readSettings.done,
  fn: (store, { result }) => (result ? result.cwd || store || null : store),
  target: model.$cwd,
});

ef.sample({
  source: model.$hotKeys,
  clock: model.readSettings.done,
  fn: (store, { result }) => (result ? result.hotKeys || store || null : store),
  target: model.$hotKeys,
});

ef.sample({
  source: model.$commitTypes,
  clock: model.readSettings.done,
  fn: (store, { result }) => (result ? result.commitTypes || store : store),
  target: model.$commitTypes,
});
