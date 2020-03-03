import { Pipe } from "lib/pipe-v2";

import { RunCommandOptions, isOptions } from "./run-command";
import { runCommandPipe, PipeValue } from "./run-command-pipe";

export function runCommandGit(
  command: string,
  options?: RunCommandOptions,
): Pipe<PipeValue>;
export function runCommandGit(
  command: string,
  args?: string[],
): Pipe<PipeValue>;
export function runCommandGit(
  command: string,
  args?: string[],
  options?: RunCommandOptions,
): Pipe<PipeValue>;
export function runCommandGit(
  command: string,
  _args?: RunCommandOptions | string[],
  _options: RunCommandOptions = {},
): Pipe<PipeValue> {
  const args = isOptions(_args) ? [] : _args || [];
  const options = isOptions(_args) ? _args : _options;

  args.unshift(command);

  return runCommandPipe("git", args, options);
}
