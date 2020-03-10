import { sample, createEvent, Effect } from "effector";
import { Params } from "lib/added-effector/create-git-proxy-effect";
import { ResolverStoreItem } from "lib/pipe";

import { $commandOptions } from "./stores";

type GetParams<P> = (value: P | void) => P;

export const createRunCommandEvent = <P extends object>(
  target: Effect<Params<P>, ResolverStoreItem<string>[], Error>,
  getParams?: GetParams<P>,
) => {
  const event = createEvent<P | void>();

  sample({
    source: $commandOptions,
    clock: event,
    fn: (options, paramsEvent): Params<P> => ({
      options,
      params: {
        ...(getParams ? getParams(paramsEvent) : ({} as P)),
        ...paramsEvent,
      },
    }),
    target,
  });

  return event;
};
