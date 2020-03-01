import { createPipe, Pipe } from "lib/pipe";

import { RunCommandOptions, isOptions, runCommand } from "./main";

export function runCommandPipe(
  command: string,
  options?: RunCommandOptions,
): Pipe<string, number>;
export function runCommandPipe(
  command: string,
  args?: string[],
): Pipe<string, number>;
export function runCommandPipe(
  command: string,
  args?: string[],
  options?: RunCommandOptions,
): Pipe<string, number>;
export function runCommandPipe(
  command: string,
  _args?: RunCommandOptions | string[],
  _options: RunCommandOptions = {},
): Pipe<string, number> {
  const args = isOptions(_args) ? [] : _args || [];
  const options = isOptions(_args) ? _args : _options;

  const runningCommand = runCommand(command, args, options);
  const pipe = createPipe<string, number>();

  runningCommand.data(pipe.resolve);
  runningCommand.close(pipe.close);

  return pipe;
}
