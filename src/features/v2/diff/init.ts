import { createDependRunCommandOptions } from "features/v2/settings/model";

import { diff, getDiff, $diff } from "./model";
import { parseResult } from "lib/diff";

createDependRunCommandOptions({
  event: getDiff,
  effect: diff,
});

$diff.on(diff.done, ({ unstaged, staged }, { result }) => {
  const files = parseResult(result);

  files.forEach((file) => unstaged.set(file.path, file));

  return { unstaged, staged };
});
