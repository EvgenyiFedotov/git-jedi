import * as fs from "fs";
import { sha1 } from "object-hash";
import { createPipe, Pipe } from "lib/pipe";

export type Action = "created" | "changed" | "deleted";

export interface FileWatcherOptions {
  isWatch?: boolean;
}

export interface FileWatcher {
  path: () => string;
  onChange: (
    cb: (value: { action: Action; data: Buffer }) => void,
  ) => FileWatcher;
  watch: () => FileWatcher;
  stop: () => FileWatcher;
}

export const createFileWatcher = (
  path: string,
  options: FileWatcherOptions = {},
): FileWatcher => {
  let { isWatch = true } = options;
  const checkHash = updateHashFile();
  const pipe = createPipe<{ action: Action; data: Buffer }>();
  let isExisFilePrev = fs.existsSync(path);

  const nextTick = async () => {
    const isExisFile = await existFile(path);

    if (isExisFile) {
      const data = await readFile(path);
      const isChanged = checkHash(data);
      const action: Action = isExisFilePrev ? "changed" : "created";

      if (isChanged || action === "created") {
        pipe.resolve({ action, data });
      }

      isExisFilePrev = true;
    } else {
      if (isExisFilePrev) {
        pipe.resolve({ action: "deleted", data: new Buffer([]) });
        pipe.close();
        isExisFilePrev = false;
      }
    }

    if (isWatch) {
      await delay()();
      process.nextTick(nextTick);
    }
  };

  const result: FileWatcher = {
    path: () => path,
    onChange: (cb) => {
      pipe.next(cb);
      return result;
    },
    watch: () => {
      isWatch = true;
      return result;
    },
    stop: () => {
      isWatch = false;
      return result;
    },
  };

  process.nextTick(nextTick);

  return result;
};

function existFile(path: string) {
  return new Promise<boolean>((resolve) => {
    fs.exists(path, (value) => resolve(value));
  });
}

function readFile(path: string) {
  return new Promise<Buffer>((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

function updateHashFile(defaultHash: string = "") {
  let prevHashFile = defaultHash;

  return (data: Buffer) => {
    const nextHashFile = sha1(data);
    let result = false;

    if (prevHashFile && prevHashFile !== nextHashFile) {
      result = true;
    }

    prevHashFile = nextHashFile;

    return result;
  };
}

function delay(value: number = 100) {
  return () => new Promise((resolve) => setTimeout(resolve, value));
}
