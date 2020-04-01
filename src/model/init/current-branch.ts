import * as ef from "effector";

import { $cwd } from "../static/settings";
import { attachRunCommand } from "../static/run-command";
import * as model from "../static/current-branch";

ef.forward({
  from: $cwd,
  to: model.loadCurrentBranch,
});

attachRunCommand({
  event: model.loadCurrentBranch,
  effect: model.gitCurrentBranchName,
});

ef.guard({
  source: model.$currentBranch,
  filter: (value) => value === "HEAD",
  target: model.loadCurrentBranchByHash.prepend((_: any) => {}),
});

attachRunCommand({
  event: model.loadCurrentBranchByHash,
  effect: model.gitCurrentBranchHash,
});

model.$currentBranch.on(model.gitCurrentBranchName.done, (_, { result }) =>
  toCurrentBranch(result.data()[0]),
);

model.$currentBranch.on(model.gitCurrentBranchHash.done, (_, { result }) =>
  toCurrentBranch(result.data()[0]).slice(0, 8),
);

model.$currentBranch.on(
  ef.merge([model.gitCurrentBranchName.fail, model.gitCurrentBranchHash.fail]),
  () => "",
);

function toCurrentBranch(value: string): string {
  return value.replace("\n", "").trim();
}
