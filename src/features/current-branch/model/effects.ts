import { createGitProxyEffect } from "lib/added-effector/create-git-proxy-effect";
import { revParse as revParseGit } from "lib/git-proxy/rev-parse";

export const revParse = createGitProxyEffect(revParseGit);
