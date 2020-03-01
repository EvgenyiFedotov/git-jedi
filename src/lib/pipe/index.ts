export interface Pipe<Value, EndValue = any> {
  next: <Result>(
    callback: (value: Value, icr: number) => Result | Pipe<Result>,
  ) => Pipe<Result, EndValue>;
  resolve: (value: Value) => void;

  end: (
    callback: (value: EndValue | undefined, icr: number) => void,
  ) => Pipe<Value, EndValue>;
  close: (value?: EndValue) => void;

  destroy: () => void;
}

const isPipe = <Value, EndValue>(x: any): x is Pipe<Value, EndValue> => {
  return typeof x === "object" && !!x.next && !!x.destroy;
};

export const createPipe = <Value, EndValue = any>() => {
  let nextCallbacks: ((value: Value, icr: number) => any)[] = [];
  let endCallbacks: ((value: EndValue | undefined, icr: number) => void)[] = [];
  let pipes: Pipe<any, any>[] = [];
  let indexCallResolve = 0;

  const result: Pipe<Value, EndValue> = {
    next: <Result>(
      callback: (value: Value, icr: number) => Result | Pipe<Result>,
    ) => {
      const pipe = createPipe<Result, EndValue>();

      nextCallbacks.push(callback);
      pipes.push(pipe);

      return pipe;
    },
    resolve: (value: Value) => {
      nextCallbacks.forEach((callback, index) => {
        const result = callback(value, indexCallResolve);

        if (isPipe(result)) {
          result.next(pipes[index].resolve);
        } else {
          pipes[index].resolve(result);
        }
      });
      indexCallResolve += 1;
    },

    end: (callback: (value: EndValue | undefined, icr: number) => void) => {
      endCallbacks.push(callback);

      return result;
    },
    close: (value?: EndValue) => {
      endCallbacks.forEach((callback) => callback(value, indexCallResolve));
      pipes.forEach((pipe) => pipe.close(value));
      indexCallResolve = 0;
    },

    destroy: () => {
      pipes.forEach((pipe) => pipe.destroy());
      nextCallbacks = [];
      endCallbacks = [];
      pipes = [];
      indexCallResolve = 0;
    },
  };

  return result;
};
