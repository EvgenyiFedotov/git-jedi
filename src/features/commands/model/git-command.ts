import { $workDir } from "features/settings";
import { RunCommandOptions } from "lib/run-command";
import { createCommand } from "lib/create-command";

export function gitCommand(command: string, args: string[]) {
  const baseOptions: RunCommandOptions = {
    spawnOptions: { cwd: $workDir.getState() || "/" },
    commandOptions: {
      onBefore: ({ command, args = [] }) =>
        console.log([command, ...args].join(" ")),
      onClose: (code, { log, ...other }) => {
        if (code) {
          const strlog = log.map(({ data }) => data).join("\n");

          console.error(strlog);
          console.log(other);
        }
      },
    },
  };

  return createCommand("git", [command, ...args], baseOptions)
    .run()
    .promise();
}
