import { createDependRunCommandOptions } from "features/v2/settings/model";

import { gitStatusS, getStatusS, $status } from "./model";

createDependRunCommandOptions({
  event: getStatusS,
  effect: gitStatusS,
});

$status.on(gitStatusS.done, (_, { result }) =>
  result
    .filter(({ action }) => action === "data")
    .map(({ value }) => value.split("\n"))
    .reduce((memo, lines) => [...memo, ...lines], [])
    .filter(Boolean)
    .map((line) => ({
      stage: line[0],
      unstage: line[1],
      path: line.slice(3),
    })),
);

$status.watch(console.log);

// type StatusFileAction =
//   | "unmodified"
//   | "modified"
//   | "added"
//   | "deleted"
//   | "renamed"
//   | "copied"
//   | "updated but unmerged"
//   | "untracked"
//   | "ignored"
//   | null;

// function toStatusFileAction(action: string): StatusFileAction {
//   switch (action) {
//     case " ":
//       return "unmodified";
//     case "M":
//       return "modified";
//     case "A":
//       return "added";
//     case "D":
//       return "deleted";
//     case "R":
//       return "renamed";
//     case "C":
//       return "copied";
//     case "U":
//       return "updated but unmerged";
//     case "?":
//       return "untracked";
//     case "!":
//       return "ignored";
//     default:
//       return null;
//   }
// }
