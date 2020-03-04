import { Pipe, ResolverStoreItem } from "lib/pipe-v2";
import { v4 as uuid } from "uuid";

import { PipeValue } from "./run-command-pipe";

export const commandPipeToPromise = (pipe: Pipe<PipeValue>) => {
  const listenerId = uuid();

  return new Promise<ResolverStoreItem<string>[]>((resolve, reject) => {
    pipe.listen((value, action) => {
      if (action === "close") {
        if (value === 0) {
          resolve(pipe.resolvedStore().get(listenerId));
        } else {
          reject(value);
        }
      }

      return value;
    }, listenerId);
  });
};
