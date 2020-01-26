import childProcess from "child_process";

export interface BaseOptions {
  execOptions?: childProcess.ExecOptions;
  key?: string;
  onExec?: (command: string, options?: BaseOptions) => void;
  onResolve?: (
    stdout: string,
    _: { command: string; options?: BaseOptions }
  ) => void;
  onReject?: (
    _: {
      error: childProcess.ExecException;
      stderr?: string;
    },
    __: { command: string; options?: BaseOptions }
  ) => void;
}

export const exec = (
  command: string,
  options: BaseOptions = {}
): Promise<string> => {
  const {
    execOptions = {},
    onExec = () => {},
    onResolve = () => {},
    onReject = () => {}
  } = options;

  onExec(command, options);

  return new Promise((resolve, reject) => {
    childProcess.exec(command, execOptions, (error, stdout, stderr) => {
      if (error) {
        onReject({ error, stderr }, { command, options });
        reject({ error, stderr });
        return;
      }

      onResolve(stdout, { command, options });
      resolve(stdout);
    });
  });
};

export const execSync = (
  command: string,
  options: BaseOptions = {}
): string => {
  const {
    execOptions = {},
    onExec = () => {},
    onResolve = () => {},
    onReject = () => {}
  } = options;

  onExec(command);

  try {
    const result = childProcess.execSync(command, execOptions).toString();
    onResolve(result, { command, options });
    return result;
  } catch (error) {
    onReject({ error }, { command, options });
    throw new Error(error);
  }
};
