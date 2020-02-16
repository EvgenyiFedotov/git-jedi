import { FileWatcher } from "lib/file-watcher";
import fs from "fs";
import { createPipe } from "lib/pipe";

export interface FileConnectorConfig {
  fileWatcher: FileWatcher;
  id: string;
}

export interface FileConnector {
  onMessage: <Message>(
    cb: (_: { message: Message; id: string }) => void,
  ) => FileConnector;
  send: (message: any) => FileConnector;
}

export const createFileConnector = (
  config: FileConnectorConfig,
): FileConnector => {
  const { fileWatcher, id } = config;
  const pipe = createPipe<{ message: any; id: string }>();

  fileWatcher.onChange(({ data }) => {
    const dataString = data.toString();

    if (dataString) {
      const { id: authorId, message } = JSON.parse(dataString);

      if (authorId !== id) {
        pipe.resolve({ message, id: authorId });
      }
    }
  });

  const result: FileConnector = {
    onMessage: (cb) => {
      pipe.next(cb);
      return result;
    },
    send: (message: any) => {
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
