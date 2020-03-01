import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface RemoteAddOptions extends RunCommandOptions {
  name: string;
  url: string;
}

export const remote = {
  add: (options: RemoteAddOptions) => {
    const args = createArgsAdd(options);

    return runCommandGit("remote", ["add", ...args], options);
  },
};

function createArgsAdd(options: RemoteAddOptions) {
  const { name, url } = options;

  return [name, url];
}
