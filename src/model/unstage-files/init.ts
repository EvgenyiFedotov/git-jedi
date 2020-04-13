import * as ef from "effector";
import { createPatchByChunk, createPatchByLine } from "lib/diff";

import { attachRunCommand } from "../run-command";
import { $stagedFiles, loadStatusFiles } from "../status-files";
import * as st from ".";

attachRunCommand({
  event: ef.sample($stagedFiles, st.unstageAll).map((unstagedFiles) => ({
    paths: unstagedFiles.map(({ path }) => path),
  })),
  effect: st.unstage,
});

attachRunCommand({
  event: st.unstageFile.map((path) => ({ paths: [path] })),
  effect: st.unstage,
});

attachRunCommand({
  event: st.unstageChunk.map((diffChunk) => ({
    path: diffChunk.file.path,
    patch: createPatchByChunk(diffChunk, true),
  })),
  effect: st.unstageByPatchChunk,
});

attachRunCommand({
  event: st.unstageLine.map((diffLine) => ({
    path: diffLine.chunk.file.path,
    patch: createPatchByLine(diffLine, true),
  })),
  effect: st.unstageByPatchLine,
});

// Updadet $statusFiles
ef.forward({
  from: ef.merge([
    st.unstage.done,
    st.unstageByPatchChunk.done,
    st.unstageByPatchLine.done,
  ]),
  to: loadStatusFiles,
});
