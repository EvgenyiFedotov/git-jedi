import childProcess from "child_process";

export interface BaseOptions {
  execOptions?: childProcess.ExecOptions;
  onExec?: (command: string) => void;
  onResolve?: (stdout: string) => void;
  onReject?: (_: {
    error: childProcess.ExecException;
    stderr?: string;
  }) => void;
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

  onExec(command);

  return new Promise((resolve, reject) => {
    childProcess.exec(command, execOptions, (error, stdout, stderr) => {
      if (error) {
        onReject({ error, stderr });
        reject({ error, stderr });
        return;
      }

      onResolve(stdout);
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
    onResolve(result);
    return result;
  } catch (error) {
    onReject({ error });
    throw new Error(error);
  }
};
