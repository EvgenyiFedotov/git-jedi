import { sample, forward } from "effector";

import { $runCommandOptions } from "../config";
import { refreshStatus } from "../changes";
import { getDiffFile, stageChunk } from "./events";
import { diff, updateDiff, createPatchByChunk } from "./effects";
import { $diffFilesParams } from "./diff-files-params";

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
  clock: refreshStatus,
  target: updateDiff,
});

forward({ from: stageChunk, to: createPatchByChunk });
