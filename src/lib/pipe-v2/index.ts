import { v4 as uuid } from "uuid";

type Callback<Value, Result> = (
  value: Value,
  action?: string,
) => Result | Pipe<Result> | Promise<Result | Pipe<Result>>;

interface ResolverStoreItem {
  value: any;
  action?: string;
}

export interface Pipe<Value> {
  listen: <Result>(
    callback: Callback<Value, Result>,
    key?: string,
  ) => Pipe<Value>;
  next: <Result>(
    callback: Callback<Value, Result>,
    key?: string,
  ) => Pipe<Result>;
  resolve: (value: Value, action?: string) => Promise<Map<string, any>>;
  resolvedStore: () => Map<string, ResolverStoreItem[]>;
}

const isPipe = <Value>(x: any): x is Pipe<Value> => {
  return typeof x === "object" && !!x.next && !!x.resolve;
};

export interface CreatePipeOptions {
  saveResolveResult?: boolean;
}

export const createPipe = <Value>(options: CreatePipeOptions = {}) => {
  const { saveResolveResult = false } = options;

  const callbacks: Map<
    string,
    (value: Value, action?: string) => any
  > = new Map();
  const pipes: Map<string, Pipe<any>> = new Map();
  const resolvedStore: Map<string, ResolverStoreItem[]> = new Map();

  const result: Pipe<Value> = {
    listen: (callback, key: string = uuid()) => {
      callbacks.set(key, callback);

      return result;
    },

    next: <Result>(callback: Callback<Value, Result>, key: string = uuid()) => {
      const pipe = createPipe<Result>();

      result.listen(callback, key);
      pipes.set(key, pipe);

      return pipe;
    },

    resolve: async (value: Value, action?: string) => {
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
