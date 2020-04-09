import { attachRunCommand } from "../run-command";
import { toDiffFiles } from "lib/diff";

import * as st from ".";

attachRunCommand({
  event: st.loadUnstagedDiff,
  effect: st.unstagedDiff,
});

st.$unstagedDiffs.on(st.unstagedDiff.done, ({ ref }, { result }) => {
  toDiffFiles(result).forEach((diffFile) => {
    ref.set(diffFile.path, diffFile);
  });

  return { ref };
});
