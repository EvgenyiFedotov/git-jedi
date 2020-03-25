import { createPipe, Pipe, ResolverStoreItem } from "lib/pipe";
import { v4 as uuid } from "uuid";
import { RunCommandOptions, isOptions, runCommand } from "lib/run-command";

export type PipeValue = string | number;

export type PipeActions = "data" | "close";

export type ResultPromise = ResolverStoreItem<PipeValue, PipeActions>[];

export type RunCommand = {
  pipe: () => Pipe<PipeValue, PipeActions>;
  promise: () => Promise<ResultPromise>;
};

export type Command = {
  run: (options?: RunCommandOptions) => RunCommand;
};

export const isCommand = (x: any): x is Command => {
  return !!(x && x.run instanceof Function);
};

export function createCommand(
  command: string,
  options?: RunCommandOptions,
): Command;
export function createCommand(command: string, args?: string[]): Command;
export function createCommand(
  command: string,
  args?: string[],
  options?: RunCommandOptions,
): Command;
export function createCommand(
  command: string,
  _args?: RunCommandOptions | string[],
  _options: RunCommandOptions = {},
): Command {
  const run = (runOptions?: RunCommandOptions): RunCommand => {
    const args = isOptions(_args) ? [] : _args || [];
    const options = isOptions(_args) ? _args : _options;

    const runningCommand = runCommand(command, args, {
      ...options,
      ...runOptions,
    });
    const pipe = createPipe<PipeValue, PipeActions>({
      saveResolveResult: true,
    });

    runningCommand.data((value) => pipe.resolve(value, "data"));
    runningCommand.close((value) => pipe.resolve(value, "close"));

    const promise = () => {
      const listenerId = uuid();

      return new Promise<ResultPromise>((resolve, reject) => {
        pipe.listen((value, action) => {
          if (action === "close") {
            if (value === 0) {
              const listenerResults = pipe.resolvedStore().get(listenerId);

              if (listenerResults) {
                resolve([...listenerResults, { value, action }]);
              } else {
                resolve([]);
              }
            } else {
              reject(value);
            }
          }

          return value;
        }, listenerId);
      });
    };

    return {
      pipe: () => pipe,
      promise,
    };
  };

  return { run };
}
