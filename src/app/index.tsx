import * as React from "react";
import * as gitApi from "../lib/git-api";

export const App = () => {
  // console.log(gitApi.core.branch.getLocal());
  // console.log(gitApi.core.branch.getOrigin());
  // console.log(gitApi.core.log.getParentLabel());
  // console.log(gitApi.core.log.get("master"));
  // console.log(gitApi.core.revParse.getCurrentBranch());
  console.log(gitApi.added.logTree.get());

  return <div></div>;
};
