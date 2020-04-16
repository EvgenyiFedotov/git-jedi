import { createEffect, Effect } from "effector";
import {
  RunCommandOptions,
  isOptions as isOptionsRunCommand,
} from "lib/run-command";
import {
  Command,
  ResultPromise,
  createCommand,
  isCommand,
} from "lib/create-command";

export type Params<P = void> = {
  params: P;
  options?: RunCommandOptions;
};

export type Options<P = void> = {
  command: (
    _: Params<P>,
  ) =>
    | Command
    | Promise<Command>
    | Promise<ResultPromise>
    | Promise<Command | ResultPromise>;
};

export function isOptions<P = void>(x: any): x is Options<P> {
  return !!(x && x.command);
}

export function createCommandEffect<P = void>(
  command: string,
  commandOptions?: RunCommandOptions,
): Effect<Params<P>, ResultPromise>;

export function createCommandEffect<P = void>(
  command: string,
  args?: (params: P) => string[],
): Effect<Params<P>, ResultPromise>;

export function createCommandEffect<P = void>(
  command: string,
  args?: (params: P) => string[],
  commandOptions?: RunCommandOptions,
): Effect<Params<P>, ResultPromise>;

export function createCommandEffect<P = void>(
  options: Options<P>,
): Effect<Params<P>, ResultPromise>;

export function createCommandEffect<P = void>(
  command: Options<P> | string,
  args?: RunCommandOptions | ((params: P) => string[]),
  commandOptions?: RunCommandOptions,
): Effect<Params<P>, ResultPromise> {
  if (isOptions<P>(command)) {
    return createCommandEffectByOptions<P>(command);
  }

  return createCommandEffectByCommand(command, args, commandOptions);
}

function createCommandEffectByOptions<P = void>(
  options: Options<P>,
): Effect<Params<P>, ResultPromise> {
  return createEffect<Params<P>, ResultPromise>({
    handler: async (_) => {
      const value = await options.command(_);

      if (isCommand(value)) {
        return value.run().promise();
      }

      return value;
    },
  });
}

function createCommandEffectByCommand<P = void>(
  command: string,
  _args?: RunCommandOptions | ((params: P) => string[]),
  _commandOptions?: RunCommandOptions,
): Effect<Params<P>, ResultPromise> {
  const defGetArgs = () => [];
  const args = isOptionsRunCommand(_args) ? defGetArgs : _args || defGetArgs;
  const commandOptions = isOptionsRunCommand(_args) ? _args : _commandOptions;

  return createEffect<Params<P>, ResultPromise>({
    handler: ({ params, options }) =>
      createCommand(command, args(params), commandOptions)
        .run(options)
        .promise(),
  });
}
