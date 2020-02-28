import { Pipe } from "lib/pipe";

export const pipeToPromise = <V>(pipe: Pipe<V, number>) => {
  const log: V[] = [];

  return new Promise<V[]>((resolve, reject) => {
    pipe.next((value) => {
      log.push(value);
      return value;
    });
    pipe.end((code) => {
      if (code === 0) {
        resolve(log);
      } else {
        reject(code);
      }
    });
  });
};

export const reduceConcatMap = <K, T>(value: Map<K, T>[]): Map<K, T> => {
  return value.reduce((memo, chunk) => new Map([...memo, ...chunk]), new Map());
};
