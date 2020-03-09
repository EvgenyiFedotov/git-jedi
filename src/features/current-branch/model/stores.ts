import { createStore } from "effector";

import { revParse } from "./effects";

export const $currentBranch = createStore<string>("");

$currentBranch.on(revParse.done, (_, { params, result }) => {
  const nextValue = result[0].value.replace("\n", "").trim();
  const isCommitHash = params.params.mode === "commitHash";

  return isCommitHash ? nextValue.slice(0, 8) : nextValue;
});
$currentBranch.on(revParse.fail, () => "");
