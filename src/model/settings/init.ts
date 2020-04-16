import * as ef from "effector";

import * as st from ".";

const setupDefaultSettings = ef.guard({
  source: st.readSettings.done,
  filter: ({ result }) => !result,
});

ef.forward({
  from: st.initSettings,
  to: st.readSettings,
});

ef.sample({
  source: st.$settings,
  clock: setupDefaultSettings,
  target: st.writeSettings,
});

ef.forward({
  from: st.$settings,
  to: st.writeSettings,
});

// Add, remove commit types
ef.sample({
  source: ef.combine([st.$newCommitType, st.$commitTypes]),
  clock: st.addNewCommitType,
  fn: ([newType, commitTypes]) => {
    const index = commitTypes.indexOf(newType);

    if (index === -1) {
      return [...commitTypes, newType];
    }

    return commitTypes;
  },
  target: st.$commitTypes,
});

ef.sample({
  source: st.$commitTypes,
  clock: st.removeCommitType,
  fn: (commitTypes, removeType) => {
    const index = commitTypes.indexOf(removeType);

    if (index === -1) {
      return commitTypes;
    }

    const next = [...commitTypes];

    next.splice(index, 1);

    return next;
  },
  target: st.$commitTypes,
});

st.$newCommitType.on(st.$commitTypes, () => "");

// Setup default item settings

ef.sample({
  source: st.$cwd,
  clock: st.readSettings.done,
  fn: (store, { result }) => (result ? result.cwd || store || null : store),
  target: st.$cwd,
});

ef.sample({
  source: st.$hotKeys,
  clock: st.readSettings.done,
  fn: (store, { result }) => (result ? result.hotKeys || store || null : store),
  target: st.$hotKeys,
});

ef.sample({
  source: st.defaultBranch.$value,
  clock: st.readSettings.done,
  fn: (store, { result }) =>
    result ? result.defaultBranch || store || "" : store,
  target: st.defaultBranch.$value,
});

ef.sample({
  source: st.$commitTypes,
  clock: st.readSettings.done,
  fn: (store, { result }) => (result ? result.commitTypes || store : store),
  target: st.$commitTypes,
});

ef.sample({
  source: st.$commitScopeRoot,
  clock: st.readSettings.done,
  fn: (store, { result }) => (result ? result.commitScopeRoot || store : store),
  target: st.$commitScopeRoot,
});

ef.sample({
  source: st.$commitScopeLength,
  clock: st.readSettings.done,
  fn: (store, { result }) =>
    result ? result.commitScopeLength || store : store,
  target: st.$commitScopeLength,
});

// Select cwd
ef.sample({
  source: st.$cwd,
  clock: st.selectCwd,
  fn: (cwd) => cwd || "/",
  target: st.showSelectCwdDialog,
});

ef.guard({
  source: st.readSettings.done,
  filter: ({ result }) => !!result && !result.cwd,
  target: st.selectCwd.prepend((_: any) => {}),
});

const changeCwdAfterSelect = ef.sample({
  source: st.$cwd,
  clock: st.showSelectCwdDialog.done,
  fn: (store, { result }) => ({
    store,
    next: result.filePaths[0] || store || null,
  }),
});

ef.forward({
  from: changeCwdAfterSelect.map(({ next }) => next),
  to: st.$cwd,
});

ef.guard({
  source: changeCwdAfterSelect,
  filter: ({ store, next }) => store !== next,
  target: st.changedCwd.prepend(
    ({ next }: { store: string | null; next: string | null }) => next,
  ),
});
