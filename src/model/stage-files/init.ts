import * as ef from "effector";
import { createPatchByChunk, createPatchByLine } from "lib/diff";

import { attachRunCommand } from "../run-command";
import { $unstagedFiles, loadStatusFiles } from "../status-files";
import * as st from ".";

// Attach commands
attachRunCommand({
  event: st.stageFile.map((path) => ({ paths: [path] })),
  effect: st.stage,
});

attachRunCommand({
  event: ef.sample($unstagedFiles, st.stageAll).map((unstagedFiles) => ({
    paths: unstagedFiles.map(({ path }) => path),
  })),
  effect: st.stage,
});

attachRunCommand({
  event: st.stageChunk.map((diffChunk) => ({
    patch: createPatchByChunk(diffChunk),
  })),
});

attachRunCommand({
  event: st.stageLine.map((diffLine) => ({
    patch: createPatchByLine(diffLine),
  })),
  effect: st.stageByPatchLine,
});

// Updadet $statusFiles
ef.forward({
  from: ef.merge([
    st.stage.done,
    st.stageByPatchChunk.done,
    st.stageByPatchLine.done,
  ]),
  to: loadStatusFiles,
});
