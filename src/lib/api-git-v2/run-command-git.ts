import { runCommand, RunCommandOptions, isOptions } from "./run-command";
import { Pipe, createPipe } from "./pipe";

export {
  RunCommandScope,
  RunCommandOnBefore,
  RunCommandOnData,
  RunCommandOnError,
  RunCommandOnClose,
  RunCommandOptions,
  RunCommandCallbackChannel,
  RunCommandCallback,
  RunCommandResult,
  RunCommandLogItem,
  runCommand,
} from "./run-command";

export function runCommandGit(
  command: string,
  options?: RunCommandOptions,
): Pipe<string, number>;
export function runCommandGit(
  command: string,
  args?: string[],
): Pipe<string, number>;
export function runCommandGit(
  command: string,
  args?: string[],
  options?: RunCommandOptions,
): Pipe<string, number>;
export function runCommandGit(
  command: string,
  _args?: RunCommandOptions | string[],
  _options: RunCommandOptions = {},
): Pipe<string, number> {
  const args = isOptions(_args) ? [] : _args || [];
  const options = isOptions(_args) ? _args : _options;

  args.unshift(command);

  const runningCommand = runCommand("git", args, {
    commandOptions: options && options.commandOptions,
    spawnOptions: options && options.spawnOptions,
  });
  const pipe = createPipe<string, number>();

  runningCommand.data(pipe.resolve);
  runningCommand.close(pipe.close);

  return pipe;
}
