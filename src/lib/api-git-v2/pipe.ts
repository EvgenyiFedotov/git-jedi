export interface Pipe<Value, EndValue> {
  next: <Result>(
    callback: (value: Value, icr: number) => Result,
  ) => Pipe<Result, EndValue>;
  resolve: (value: Value) => void;

  end: (
    callback: (value: EndValue, icr: number) => void,
  ) => Pipe<Value, EndValue>;
  close: (value: EndValue) => void;

  destroy: () => void;
}

export const createPipe = <Value, EndValue>() => {
  let nextCallbacks: ((value: Value, icr: number) => any)[] = [];
  let endCallbacks: ((value: EndValue, icr: number) => void)[] = [];
  let pipes: Pipe<any, any>[] = [];
  let indexCallResolve = 0;

  const result: Pipe<Value, EndValue> = {
    next: <Result>(callback: (value: Value, icr: number) => Result) => {
      const pipe = createPipe<Result, EndValue>();
      nextCallbacks.push(callback);
      pipes.push(pipe);
      return pipe;
    },
    resolve: (value: Value) => {
      nextCallbacks.forEach((callback, index) => {
        pipes[index].resolve(callback(value, indexCallResolve));
      });
      indexCallResolve += 1;
    },

    end: (callback: (value: EndValue, icr: number) => void) => {
      endCallbacks.push(callback);
      return result;
    },
    close: (value: EndValue) => {
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
