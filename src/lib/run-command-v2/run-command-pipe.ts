import { createPipe, Pipe } from "lib/pipe-v2";

import { RunCommandOptions, isOptions, runCommand } from "./run-command";

export type PipeValue =
  | { type: "data"; value: string }
  | { type: "close"; value: number };

export function runCommandPipe(
  command: string,
  options?: RunCommandOptions,
): Pipe<PipeValue>;
export function runCommandPipe(
  command: string,
  args?: string[],
): Pipe<PipeValue>;
export function runCommandPipe(
  command: string,
  args?: string[],
  options?: RunCommandOptions,
): Pipe<PipeValue>;
export function runCommandPipe(
  command: string,
  _args?: RunCommandOptions | string[],
  _options: RunCommandOptions = {},
): Pipe<PipeValue> {
  const args = isOptions(_args) ? [] : _args || [];
  const options = isOptions(_args) ? _args : _options;

  const runningCommand = runCommand(command, args, options);
  const pipe = createPipe<PipeValue>({ saveResolveResult: true });

  runningCommand.data((value) => pipe.resolve({ type: "data", value }));
  runningCommand.close((value) => pipe.resolve({ type: "close", value }));

  return pipe;
}
