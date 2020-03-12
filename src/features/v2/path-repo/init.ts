import { sample, guard, forward } from "effector";
import { $cwd, readSettings } from "features/v2/settings/model";
import { createCommand } from "features/v2/commands/model";

import { showSelectCwdDialog, selectPathRepo, $pathRepo } from "./model";

const commandChangePathRepo = createCommand(
  "change path repo",
  "changePathRepo",
);

sample({
  source: $cwd,
  clock: selectPathRepo,
  fn: (cwd) => cwd || "/",
  target: showSelectCwdDialog,
});

guard({
  source: readSettings.done,
  filter: ({ result }) => !!result && !result.cwd,
  target: selectPathRepo.prepend((_: any) => {}),
});

forward({
  from: commandChangePathRepo,
  to: selectPathRepo,
});

$pathRepo.on($cwd, (_, cwd) => {
  const cwdArr = (cwd || "").split("/");

  return `${cwdArr[cwdArr.length - 2]}/${cwdArr[cwdArr.length - 1]}`;
});
