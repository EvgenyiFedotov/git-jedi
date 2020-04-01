import { FileWatcher } from "lib/file-watcher";
import { createPipe } from "lib/pipe";
import * as fsPromise from "lib/fs-promise";

export type Options = {
  watcher: FileWatcher;
  id: string;
};

export type Data = {
  id: string;
  message: any;
};

export type FileConnector = {
  watch: (cb: (data: Data) => void) => void;
  send: (message: any) => void;
};

export const createFileConnector = (options: Options): FileConnector => {
  const pipe = createPipe<Data>();

  options.watcher.pipe().listen(({ action, file }) => {
    const content = file.toString();

    try {
      const data = JSON.parse(content);

      if (data.id !== options.id) {
        pipe.resolve(data);
      }
    } catch (error) {
      // pass
    }
  });

  const fileConnector: FileConnector = {
    watch: (cb) => {
      pipe.listen(cb);
    },
    send: (message) => {
      const nextData = JSON.stringify({ id: options.id, message });

      fsPromise.writeFile(options.watcher.path(), nextData);
    },
  };

  return fileConnector;
};
