import { attachRunCommand } from "../run-command";
import { toDiffFiles } from "lib/diff";

import * as st from ".";

attachRunCommand({
  event: st.loadStageDiff,
  effect: st.stagedDiff,
});

st.$stagedDiffs.on(st.stagedDiff.done, ({ ref }, { result }) => {
  toDiffFiles(result).forEach((diffFile) => {
    ref.set(diffFile.path, diffFile);
  });

  return { ref };
});
