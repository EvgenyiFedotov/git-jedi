import { v4 as uuid } from "uuid";

type Callback<Value, Result, Actions = string> = (
  value: Value,
  action?: Actions,
) => Result | Pipe<Result, Actions> | Promise<Result | Pipe<Result, Actions>>;

export interface ResolverStoreItem<Value = any, Actions = any> {
  value: Value;
  action?: Actions;
}

export interface Pipe<Value, Actions = string> {
  listen: <Result>(
    callback: Callback<Value, Result, Actions>,
    key?: string,
  ) => Pipe<Value, Actions>;
  next: <Result, NextActions = string>(
    callback: Callback<Value, Result, Actions>,
    key?: string,
  ) => Pipe<Result, NextActions>;
  resolve: (value: Value, action?: Actions) => Promise<Map<string, any>>;
  resolvedStore: () => Map<string, ResolverStoreItem[]>;
}

const isPipe = <Value, Actions>(x: any): x is Pipe<Value, Actions> => {
  return typeof x === "object" && !!x.next && !!x.resolve;
};

export interface CreatePipeOptions {
  saveResolveResult?: boolean;
}

export const createPipe = <Value, Actions = string>(
  options: CreatePipeOptions = {},
) => {
  const { saveResolveResult = false } = options;

  const callbacks: Map<
    string,
    (value: Value, action?: Actions) => any
  > = new Map();
  const pipes: Map<string, Pipe<any, any>> = new Map();
  const resolvedStore: Map<string, ResolverStoreItem[]> = new Map();

  const result: Pipe<Value, Actions> = {
    listen: (callback, key: string = uuid()) => {
      callbacks.set(key, callback);

      return result;
    },

    next: <Result, NextActions = string>(
      callback: Callback<Value, Result, Actions>,
      key: string = uuid(),
    ) => {
      const pipe = createPipe<Result, NextActions>();

      result.listen(callback, key);
      pipes.set(key, pipe);

      return pipe;
    },

    resolve: async (value: Value, action?: Actions) => {
      const callbackArr = Array.from(callbacks);
      const resolveResult: Map<string, any> = new Map();

      if (!saveResolveResult) {
        resolvedStore.clear();
      }

      for (let index = 0; index < callbackArr.length; index += 1) {
        const [key, callback] = callbackArr[index];
        const result = await callback(value, action);
        const pipe = pipes.get(key);

        resolveResult.set(key, result);

        if (resolvedStore.has(key)) {
          resolvedStore.get(key)?.push({ action, value: result });
        } else {
          resolvedStore.set(key, [{ action, value: result }]);
        }

        if (pipe) {
          if (isPipe(result)) {
            result.next(pipe.resolve, key);
          } else {
            pipe.resolve(result, action);
          }
        }
      }

      return resolveResult;
    },

    resolvedStore: () => resolvedStore,
  };

  return result;
};
