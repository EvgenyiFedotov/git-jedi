import * as ef from "effector";
import { createCommandEffect } from "lib/added-effector/command-effect";

import { Branch } from "../branches";

export const checkoutTo = createCommandEffect<{ branch: Branch }>(
  "git",
  ({ branch }) => {
    const nameArr = branch.name.split("/");
    let name = branch.name;

    // TODO check list remotes
    if (nameArr[0] === "origin" && !branch.remoteName) {
      nameArr.shift();
      name = nameArr.join("/");
    }

    return ["checkout", name];
  },
);

export const changeBranch = ef.createEvent<{ branch: Branch }>();
