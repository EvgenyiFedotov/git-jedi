import * as ef from "effector";

import { $statusFiles, loadStatusFiles } from "../static/status-files";
import { attachRunCommand } from "../static/run-command";
import * as model from "../static/discarding-files";

// Event discard all files in $statusFiles
const discardAll = ef.sample({
  source: $statusFiles.map((files) =>
    files.filter(({ unstage }) => unstage !== " ").map(({ path }) => path),
  ),
  clock: model.discardAll,
});

// Run dicarding
attachRunCommand({
  event: discardAll.map((paths) => ({ paths })),
  effect: model.discard,
});

attachRunCommand({
  event: model.dicardFile.map((path) => ({ paths: [path] })),
  effect: model.discard,
});

// Update $dicardingFiles
model.$discardingFiles
  .on(model.dicardFile, ({ ref }, path) => {
    ref.add(path);

    return { ref };
  })
  .on(discardAll, ({ ref }, paths) => {
    paths.forEach((path) => ref.add(path));

    return { ref };
  })
  .on(model.discard.done, ({ ref }, { params: { params } }) => {
    params.paths.forEach((path) => ref.delete(path));

    return { ref };
  });

// Update $statusFiles after discarding
ef.forward({
  from: model.discard.done,
  to: loadStatusFiles,
});
