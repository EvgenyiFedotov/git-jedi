import { sample, forward, guard } from "effector";

import { $runCommandOptions } from "../config";
import { $status, refreshStatus } from "../changes";
import { getDiffFile, changeStageChunk } from "./events";
import {
  diff,
  updateDiff,
  createPatchByChunk,
  addChunk,
  writeAddEditFile,
} from "./effects";
import { $diffFilesParams } from "./diff-files-params";
import { changeContentFile } from "../editor";

sample({
  source: $runCommandOptions,
  clock: getDiffFile,
  fn: (options, { path, cached }) => ({
    ...options,
    paths: [path],
    cached,
  }),
  target: diff,
});

sample({
  source: $diffFilesParams,
  clock: $status,
  target: updateDiff,
});

forward({ from: changeStageChunk, to: createPatchByChunk });

sample({
  source: $runCommandOptions,
  clock: changeStageChunk,
  target: addChunk,
});

sample({
  source: createPatchByChunk.done,
  clock: guard({
    source: changeContentFile,
    filter: ({ fileName }) => fileName === "ADD_EDIT.patch",
  }),
  fn: ({ result }, { pathFile }) => ({
    content: result,
    pathFile,
  }),
  target: writeAddEditFile,
});

forward({ from: addChunk.done, to: refreshStatus });
