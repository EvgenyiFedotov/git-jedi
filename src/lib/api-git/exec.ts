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
