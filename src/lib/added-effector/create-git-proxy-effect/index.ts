import { createEffect } from "effector";
import { ResolverStoreItem, Pipe } from "lib/pipe";
import {
  commandPipeToPromise,
  RunCommandOptions,
  PipeValue,
} from "lib/run-command";

export interface Params<P extends object> {
  params: P;
  options?: RunCommandOptions;
}

export type Callback<P> = (
  params: P,
  options?: RunCommandOptions,
) => Pipe<PipeValue>;

export type Result = ResolverStoreItem<string>[];

export const createGitProxyEffect = <P extends object>(cb: Callback<P>) => {
  return createEffect<Params<P>, Result>({
    handler: ({ params, options }) => commandPipeToPromise(cb(params, options)),
  });
};
