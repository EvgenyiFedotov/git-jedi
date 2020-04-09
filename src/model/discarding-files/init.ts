import * as ef from "effector";

import { $statusFiles, loadStatusFiles } from "../status-files";
import { attachRunCommand } from "../run-command";
import * as st from ".";

// Event discard all files in $statusFiles
const discardAll = ef.sample({
  source: $statusFiles.map((files) =>
    files.filter(({ unstage }) => unstage !== " ").map(({ path }) => path),
  ),
  clock: st.discardAll,
});

// Run dicarding
attachRunCommand({
  event: discardAll.map((paths) => ({ paths })),
  effect: st.discard,
});

attachRunCommand({
  event: st.dicardFile.map((path) => ({ paths: [path] })),
  effect: st.discard,
});

// Update $dicardingFiles
st.$discardingFiles
  .on(st.dicardFile, ({ ref }, path) => {
    ref.add(path);

    return { ref };
  })
  .on(discardAll, ({ ref }, paths) => {
    paths.forEach((path) => ref.add(path));

    return { ref };
  })
  .on(st.discard.done, ({ ref }, { params: { params } }) => {
    params.paths.forEach((path) => ref.delete(path));

    return { ref };
  });

// Update $statusFiles after discarding
ef.forward({
  from: st.discard.done,
  to: loadStatusFiles,
});
