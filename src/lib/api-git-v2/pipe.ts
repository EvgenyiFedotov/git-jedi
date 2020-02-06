export interface Pipe<Value> {
  next: <Result>(
    callback: (value: Value, icr: number) => Result,
  ) => Pipe<Result>;
  resolve: (value: Value) => void;
  destroy: () => void;
}

export const createPipe = <Value>() => {
  let callbacks: ((value: Value, icr: number) => any)[] = [];
  let pipes: Pipe<any>[] = [];
  let indexCallResolve = 0;

  const result: Pipe<Value> = {
    next: <Result>(callback: (value: Value, icr: number) => Result) => {
      const pipe = createPipe<Result>();
      callbacks.push(callback);
      pipes.push(pipe);
      return pipe;
    },

    resolve: (value: Value) => {
      callbacks.forEach((callback, index) => {
        pipes[index].resolve(callback(value, indexCallResolve));
      });
      indexCallResolve += 1;
    },

    destroy: () => {
      pipes.forEach((pipe) => pipe.destroy());
      callbacks = [];
      pipes = [];
    },
  };

  return result;
};
