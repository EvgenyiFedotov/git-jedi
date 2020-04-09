import * as ef from "effector";
import { createPatchByChunk, createPatchByLine } from "lib/diff";

import { attachRunCommand } from "../static/run-command";
import { $unstagedFiles, loadStatusFiles } from "../static/status-files";
import * as model from "../static/stage-files";

// Attach commands
attachRunCommand({
  event: model.stageFile.map((path) => ({ paths: [path] })),
  effect: model.stage,
});

attachRunCommand({
  event: ef.sample($unstagedFiles, model.stageAll).map((unstagedFiles) => ({
    paths: unstagedFiles.map(({ path }) => path),
  })),
  effect: model.stage,
});

attachRunCommand({
  event: model.stageChunk.map((diffChunk) => ({
    patch: createPatchByChunk(diffChunk),
  })),
});

attachRunCommand({
  event: model.stageLine.map((diffLine) => ({
    patch: createPatchByLine(diffLine),
  })),
  effect: model.stageByPatchLine,
});

// Updadet $statusFiles
ef.forward({
  from: ef.merge([
    model.stage.done,
    model.stageByPatchChunk.done,
    model.stageByPatchLine.done,
  ]),
  to: loadStatusFiles,
});
