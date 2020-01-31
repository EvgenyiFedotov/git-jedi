import childProcess from "child_process";

export type BaseOptionsOnExec = (
  command: string,
  options?: BaseOptions,
) => void;

export type BaseOptionsOnResolve = (
  stdout: string,
  _: { command: string; options?: BaseOptions },
) => void;

export type BaseOptionsOnReject = (
  _: {
    error: childProcess.ExecException;
    stdout: string;
    stderr?: string;
  },
  __: { command: string; options?: BaseOptions },
) => void;

export interface BaseOptions {
  execOptions?: childProcess.ExecOptions;
  key?: string;
  onExec?: BaseOptionsOnExec;
  onResolve?: BaseOptionsOnResolve;
  onReject?: BaseOptionsOnReject;
}

export const exec = (
  command: string,
  options: BaseOptions = {},
): Promise<string> => {
  const {
    execOptions = {},
    onExec = () => {},
    onResolve = () => {},
    onReject = () => {},
  } = options;

  onExec(command, options);

  return new Promise((resolve, reject) => {
    childProcess.exec(command, execOptions, (error, stdout, stderr) => {
      if (error) {
        onReject({ error, stdout, stderr }, { command, options });
        reject({ error, stdout, stderr });
        return;
      }

      onResolve(stdout, { command, options });
      resolve(stdout);
    });
  });
};

export const execSync = (
  command: string,
  options: BaseOptions = {},
): string => {
  const {
    execOptions = {},
    onExec = () => {},
    onResolve = () => {},
    onReject = () => {},
  } = options;

  onExec(command);

  try {
    const result = childProcess.execSync(command, execOptions).toString();
    onResolve(result, { command, options });
    return result;
  } catch (error) {
    onReject({ error, stdout: "" }, { command, options });
    throw new Error(error);
  }
};

export type PipeResolveCallback = (value: any) => any;

export type PipeRejectCallback = (error: Error) => void;

export interface SpawnResult {
  then: (callback: PipeResolveCallback) => SpawnResult;
  catch: (callback: PipeRejectCallback) => SpawnResult;
}

export const spawn = (
  command: string,
  options: BaseOptions = {},
): SpawnResult => {
  const {
    execOptions = {},
    onExec = () => {},
    onResolve = () => {},
    onReject = () => {},
  } = options;

  const pipeResolveCallbacks: PipeResolveCallback[] = [];
  const pipeRejectCallback: PipeRejectCallback[] = [];
  const [firstCommand, ...commandParams] = command.split(" ");

  onExec(command);

  const childProc = childProcess.spawn(
    firstCommand,
    commandParams,
    execOptions,
  );

  childProc.stdout.on("data", (data) => {
    const dataString = data.toString();

    onResolve(dataString, { command, options });
    pipeResolveCallbacks.reduce((memo, callback) => callback(memo), dataString);
  });

  childProc.on("error", (error) => {
    onReject({ error, stdout: "" }, { command, options });
    pipeRejectCallback.forEach((callback) => callback(error));
  });

  childProc.on("close", () => {});

  const result = {
    then: (callback: PipeResolveCallback) => {
      pipeResolveCallbacks.push(callback);
      return result;
    },
    catch: (callback: PipeRejectCallback) => {
      pipeRejectCallback.push(callback);
      return result;
    },
  };

  return result;
};
