import {
  createStore,
  createEffect,
  sample,
  merge,
  createEvent,
} from "effector";
import { status as statusGit, StatusOptions, ChangeLine } from "lib/api-git";
import { pipeCommandToPromise } from "lib/pipe-command-promise";

import { $runCommandOptions } from "../../config";
import { $currentBranch } from "../../current-branch";
import { commit } from "../../log";
import { add } from "../staged/effects";
import { reset } from "../unstaged/effects";
import { discard } from "../discard-paths/effects";

export const $status = createStore<ChangeLine[]>([]);

export const status = createEffect<StatusOptions, ChangeLine[]>({
  handler: async (options) => {
    const result = await pipeCommandToPromise(statusGit(options));
    return result.reduce((memo, chunk) => [...memo, ...chunk], []);
  },
});

export const refreshStatus = createEvent<void>();

sample({
  source: $runCommandOptions,
  clock: merge([
    $runCommandOptions,
    $currentBranch,
    commit.done,
    add.done,
    reset.done,
    discard.done,
    refreshStatus,
  ]),
  target: status,
});

$status.on(status.done, (_, { result }) => result);
