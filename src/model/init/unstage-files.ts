import * as ef from "effector";
import { createPatchByChunk, createPatchByLine } from "lib/diff";

import { attachRunCommand } from "../static/run-command";
import { $stagedFiles, loadStatusFiles } from "../static/status-files";
import * as model from "../static/unstage-files";

attachRunCommand({
  event: ef.sample($stagedFiles, model.unstageAll).map((unstagedFiles) => ({
    paths: unstagedFiles.map(({ path }) => path),
  })),
  effect: model.unstage,
});

attachRunCommand({
  event: model.unstageFile.map((path) => ({ paths: [path] })),
  effect: model.unstage,
});

attachRunCommand({
  event: model.unstageChunk.map((diffChunk) => ({
    patch: createPatchByChunk(diffChunk, true),
  })),
  effect: model.unstageByPatchChunk,
});

attachRunCommand({
  event: model.unstageLine.map((diffLine) => ({
    patch: createPatchByLine(diffLine, true),
  })),
  effect: model.unstageByPatchLine,
});

// Updadet $statusFiles
ef.forward({
  from: ef.merge([
    model.unstage.done,
    model.unstageByPatchChunk.done,
    model.unstageByPatchLine.done,
  ]),
  to: loadStatusFiles,
});
