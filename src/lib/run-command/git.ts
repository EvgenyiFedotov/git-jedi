import { runCommand, RunCommandOptions, isOptions } from "./main";
import { Pipe, createPipe } from "lib/pipe";

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
