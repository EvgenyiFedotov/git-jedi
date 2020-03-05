import { createStore } from "effector";

import { revParse } from "./effects";

export const $currentBranch = createStore<string>("");

$currentBranch.on(revParse.done, (_, { result }) => {
  return result[0].value.replace("\n", "").trim();
});
