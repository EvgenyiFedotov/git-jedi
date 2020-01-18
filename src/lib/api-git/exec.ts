import childProcess from "child_process";

export interface BaseOptions {
  execOptions?: childProcess.ExecOptions;
}

export const exec = (
  command: string,
  execOptions: childProcess.ExecOptions = {}
): Promise<string> => {
  console.log(command);
  return new Promise((resolve, reject) => {
    childProcess.exec(command, execOptions, (error, stdout, stderror) => {
      if (error) {
        reject({ error, stdError: stderror });
      }

      resolve(stdout);
    });
  });
};

export const execSync = (
  command: string,
  execOptions: childProcess.ExecOptions = {}
): string => {
  console.log(command);
  return childProcess.execSync(command, execOptions).toString();
};
