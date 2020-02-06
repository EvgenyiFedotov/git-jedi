import { spawn, SpawnOptionsWithoutStdio } from "child_process";

export interface RunCommandScope {
  command: string;
  options: RunCommandOptions;
}

export type RunCommandOnBefore = (_: RunCommandScope) => void;

export interface RunCommandOptions {
  commandOptions?: {
    key?: string;
    onBefore?: RunCommandOnBefore;
  };
  args?: string[];
  spawnOptions?: SpawnOptionsWithoutStdio;
}

export type RunCommandCallbackType = "main" | "stdout" | "stderr";

export type RunCommandCallback<V = any> = (
  value: V,
  _: {
    type: RunCommandCallbackType;
    scope: RunCommandScope;
  },
) => void;

export interface RunCommandResult {
  data: (cb: RunCommandCallback<string>) => RunCommandResult;
  error: (cb: RunCommandCallback<Error>) => RunCommandResult;
  close: (cb: RunCommandCallback<number>) => RunCommandResult;
}

export const runCommand = (
  command: string,
  options: RunCommandOptions = {},
): RunCommandResult => {
  const { args = [], commandOptions = {}, spawnOptions } = options;
  const { onBefore = () => {} } = commandOptions;
  const scope = { command, options };

  const dataCallbacks: RunCommandCallback<string>[] = [];
  const errorCallbacks: RunCommandCallback<Error>[] = [];
  const closeCallbacks: RunCommandCallback<number>[] = [];

  onBefore(scope);

  const childProcess = spawn(command, args, spawnOptions);

  childProcess.stdout.on("data", (data: Buffer) => {
    const dataString = data.toString();
    dataCallbacks.forEach((cb) => cb(dataString, { type: "stdout", scope }));
  });
  childProcess.stdout.on("error", (error) => {
    errorCallbacks.forEach((cb) => cb(error, { type: "stdout", scope }));
  });

  childProcess.stderr.on("data", (data: Buffer) => {
    const dataString = data.toString();
    dataCallbacks.forEach((cb) => cb(dataString, { type: "stderr", scope }));
  });
  childProcess.stdout.on("error", (error) => {
    errorCallbacks.forEach((cb) => cb(error, { type: "stderr", scope }));
  });

  childProcess.on("close", (code) => {
    closeCallbacks.forEach((cb) => cb(code, { type: "main", scope }));
  });

  const result: RunCommandResult = {
    data: (cb) => {
      dataCallbacks.push(cb);
      return result;
    },
    error: (cb) => {
      errorCallbacks.push(cb);
      return result;
    },
    close: (cb) => {
      closeCallbacks.push(cb);
      return result;
    },
  };

  return result;
};

export const runCommandGit = (
  args: string[],
  options?: RunCommandOptions,
): RunCommandResult => {
  return runCommand("git", {
    args,
    commandOptions: options && options.commandOptions,
    spawnOptions: options && options.spawnOptions,
  });
};
