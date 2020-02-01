import childProcess from "child_process";

export type BaseOptionsOnExec = (
  command: string,
  options?: BaseOptions,
) => void;

export type BaseOptionsOnResolve = (
  stdout: string,
  _: { command: string; options?: BaseOptions; type?: string },
) => void;

export type BaseOptionsOnReject = (
  _: {
    error: childProcess.ExecException;
    stdout: string;
    stderr?: string;
  },
  __: { command: string; options?: BaseOptions; type?: string },
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

export type PipeResolveCallback = (value: any, _: { type: string }) => any;

export type PipeRejectCallback = (error: Error) => void;

export type PipeCloseCallback = (code: number) => void;

export interface SpawnResult {
  then: (callback: PipeResolveCallback) => SpawnResult;
  catch: (callback: PipeRejectCallback) => SpawnResult;
  close: (callback: PipeCloseCallback) => SpawnResult;
}

export interface SpawnOptions extends BaseOptions {
  onClose?: (code: number) => void;
}

export const spawn = (
  command: string,
  options: SpawnOptions = {},
): SpawnResult => {
  const {
    execOptions = {},
    onExec = () => {},
    onResolve = () => {},
    onReject = () => {},
    onClose = () => {},
  } = options;

  const pipeResolveCallbacks: PipeResolveCallback[] = [];
  const pipeRejectCallback: PipeRejectCallback[] = [];
  const pipeCloseCallback: PipeCloseCallback[] = [];
  const [firstCommand, ...commandParams] = command.split(" ");

  onExec(command);

  const childProc = childProcess.spawn(
    firstCommand,
    commandParams,
    execOptions,
  );

  childProc.stdout.on("data", (data) => {
    const type = "stdout";
    const dataString = data.toString();

    onResolve(dataString, { command, options, type });
    pipeResolveCallbacks.reduce(
      (memo, callback) => callback(memo, { type }),
      dataString,
    );
  });

  childProc.stderr.on("data", (data) => {
    const type = "stderr";
    const dataString = data.toString();

    onResolve(dataString, { command, options, type });
    pipeResolveCallbacks.reduce(
      (memo, callback) => callback(memo, { type }),
      dataString,
    );
  });

  childProc.on("error", (error) => {
    onReject({ error, stdout: "" }, { command, options });
    pipeRejectCallback.forEach((callback) => callback(error));
  });

  childProc.on("close", (code) => {
    onClose(code);
    pipeCloseCallback.forEach((callback) => callback(code));
  });

  const result = {
    then: (callback: PipeResolveCallback) => {
      pipeResolveCallbacks.push(callback);
      return result;
    },
    catch: (callback: PipeRejectCallback) => {
      pipeRejectCallback.push(callback);
      return result;
    },
    close: (callback: PipeCloseCallback) => {
      pipeCloseCallback.push(callback);
      return result;
    },
  };

  return result;
};
