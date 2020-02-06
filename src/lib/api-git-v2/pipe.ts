export interface Pipe<Value> {
  next: <Result>(callback: (value: Value) => Result) => Pipe<Result>;
  resolve: (value: Value) => void;
  destroy: () => void;
}

export const createPipe = <Value>() => {
  let callbacks: ((value: Value) => any)[] = [];
  let pipes: Pipe<any>[] = [];

  const result: Pipe<Value> = {
    next: <Result>(callback: (value: Value) => Result) => {
      const pipe = createPipe<Result>();
      callbacks.push(callback);
      pipes.push(pipe);
      return pipe;
    },

    resolve: (value: Value) => {
      callbacks.forEach((callback, index) => {
        pipes[index].resolve(callback(value));
      });
    },

    destroy: () => {
      pipes.forEach((pipe) => pipe.destroy());
      callbacks = [];
      pipes = [];
    },
  };

  return result;
};
