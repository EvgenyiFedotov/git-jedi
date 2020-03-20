import * as fsPromise from "lib/v2/fs-promise";

export type Options = {
  path: string;
};

export type FileJson<V extends object> = {
  read: () => Promise<V>;
  write: (value: V) => Promise<void>;
};

export const createFileReadWriteJson = <T extends object>(options: Options) => {
  const fileJson: FileJson<T> = {
    read: async () => {
      let value: T = {} as T;

      try {
        value = JSON.parse((await fsPromise.readFile(options.path)).toString());
      } catch (e) {
        // pass
      }

      return value;
    },
    write: async (value) => {
      await fsPromise.writeFile(options.path, JSON.stringify(value));
    },
  };

  return fileJson;
};
