import { createStore, createEvent, sample } from "effector";
import mousetrap from "mousetrap";

import { $formattedLog, FormattedCommitMessage } from "features/state-git";

const defCommitFormValue = { type: "feat", note: "", scope: "" };

export const $editCommitHash = createStore<string | null>(null);
export const $commitFormValue = createStore<FormattedCommitMessage>(
  defCommitFormValue,
);

export const editCommit = createEvent<string>();
export const backEditCommit = createEvent<void>();
export const saveEditCommit = createEvent();
export const changeCommitFormValue = createEvent<FormattedCommitMessage>();

sample({
  source: $formattedLog,
  clock: $editCommitHash,
  fn: (formattedLog, hash) => {
    if (hash) {
      const commit = formattedLog.get(hash);

      if (commit) {
        return {
          type: commit.type,
          note: commit.note,
          scope: commit.scope,
        };
      }
    }

    return defCommitFormValue;
  },
  target: $commitFormValue,
});

$editCommitHash.on(editCommit, (_, hash) => hash);
$editCommitHash.on(backEditCommit, () => null);

$commitFormValue.on(changeCommitFormValue, (_, value) => value);

editCommit.watch(() => {
  const inst = mousetrap.bind("escape", () => {
    inst.unbind("escape");
    backEditCommit();
  });
});
