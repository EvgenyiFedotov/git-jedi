import * as ef from "effector";

import { $cwd } from "../static/settings";
import { attachRunCommand } from "../static/run-command";
import * as model from "../static/status-files";

ef.forward({
  from: $cwd,
  to: model.loadStatusFiles,
});

attachRunCommand({
  event: model.loadStatusFiles,
  effect: model.gitStatus,
});

model.$statusFiles.on(model.gitStatus.done, (_, { result }) =>
  result
    .data()
    .map((value) => value.split("\n"))
    .reduce((memo, lines) => [...memo, ...lines], [])
    .filter(Boolean)
    .map((line) => ({
      stage: line[0],
      unstage: line[1],
      path: line.slice(3),
    })),
);
