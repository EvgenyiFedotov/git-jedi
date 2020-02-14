import { FileWatcher } from "lib/file-watcher";
import fs from "fs";
import { createPipe } from "lib/pipe";

export interface FileConnectorConfig {
  fileWatcher: FileWatcher;
  id: string;
}

export interface FileConnector {
  onMessage: (cb: (message: string) => void) => FileConnector;
  send: (message: string) => FileConnector;
}

export const createFileConnector = (
  config: FileConnectorConfig,
): FileConnector => {
  const { fileWatcher, id } = config;
  const pipe = createPipe<string>();

  fileWatcher.onChange(({ data }) => {
    const dataString = data.toString();

    if (dataString) {
      const { id: authorId, message } = JSON.parse(dataString);

      if (authorId !== id) {
        pipe.resolve(message);
      }
    }
  });

  const result: FileConnector = {
    onMessage: (cb) => {
      pipe.next(cb);
      return result;
    },
    send: (message: string) => {
      const content = JSON.stringify({
        id,
        message,
      });

      writeFile(fileWatcher.path(), content);

      return result;
    },
  };

  return result;
};

function writeFile(path: string, value: string) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, value, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
