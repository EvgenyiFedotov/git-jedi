import * as ef from "effector";

import { $cwd } from "../settings";
import { attachRunCommand } from "../run-command";
import * as st from ".";

ef.forward({
  from: $cwd,
  to: st.loadStatusFiles,
});

attachRunCommand({
  event: st.loadStatusFiles,
  effect: st.gitStatus,
});

st.$statusFiles.on(st.gitStatus.done, (_, { result }) =>
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
