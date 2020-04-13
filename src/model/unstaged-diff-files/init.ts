import * as ef from "effector";
import { toDiffFiles } from "lib/diff";

import { attachRunCommand } from "../run-command";
import { $unstagedFiles } from "../status-files";
import { stageByPatchChunk, stageByPatchLine } from "../stage-files";

import * as st from ".";

attachRunCommand({
  event: st.loadUnstagedDiff,
  effect: st.unstagedDiff,
});

attachRunCommand({
  event: ef.sample({
    source: $unstagedFiles,
    clock: stageByPatchChunk.done,
    fn: (unstagedFiles, { params }) => {
      return unstagedFiles.filter(({ path }) => path === params.params.path)[0];
    },
  }),
  effect: st.unstagedDiff,
});

attachRunCommand({
  event: ef.sample({
    source: $unstagedFiles,
    clock: stageByPatchLine.done,
    fn: (unstagedFiles, { params }) => {
      return unstagedFiles.filter(({ path }) => path === params.params.path)[0];
    },
  }),
  effect: st.unstagedDiff,
});

st.$unstagedDiffs.on(st.unstagedDiff.done, ({ ref }, { result }) => {
  toDiffFiles(result).forEach((diffFile) => {
    ref.set(diffFile.path, diffFile);
  });

  return { ref };
});
