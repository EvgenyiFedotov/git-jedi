import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface RemoteAddParams {
  name: string;
  url: string;
}

export const remoteAdd = (
  params: RemoteAddParams,
  options?: RunCommandOptions,
) => {
  const args = createArgsAdd(params);

  return runCommandGit("remote", ["add", ...args], options);
};

function createArgsAdd(params: RemoteAddParams) {
  const { name, url } = params;

  return [name, url];
}
