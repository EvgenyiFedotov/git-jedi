import { Pipe } from "lib/pipe";

import { RunCommandOptions, isOptions } from "./main";
import { runCommandPipe } from "./pipe";

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

  return runCommandPipe("git", args, options);
}
