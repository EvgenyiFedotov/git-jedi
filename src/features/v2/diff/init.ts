import { createDependRunCommandOptions } from "features/v2/settings/model";

import { diff, getDiff, $diff } from "./model";
import { parseFile } from "./parse";

createDependRunCommandOptions({
  event: getDiff,
  effect: diff,
});

$diff.on(diff.done, ({ ref }, { result }) => {
  const data = result
    .filter(({ action }) => action === "data")
    .map(({ value }) => value)
    .reduce<string[]>((memo, value) => [...memo, value], []);

  const files = data
    .map((value) => value.split("diff --git ").filter(Boolean))
    .reduce<string[]>((memo, value) => [...memo, ...value], [])
    .map(parseFile);

  files.forEach((file) => {
    ref.set(file.path, file);
  });

  return { ref };
});

$diff.watch(console.log);
