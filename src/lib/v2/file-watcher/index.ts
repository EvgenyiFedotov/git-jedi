import * as fs from "fs";
import { sha1 } from "object-hash";
import { Pipe, createPipe } from "lib/pipe";
import * as fsPromise from "lib/v2/fs-promise";

export type Options = {
  path: string;
  watch?: boolean;
};
export type PipeValue = {
  action: "created" | "changed" | "deleted";
  file: Buffer;
};
export type FileWatcher = {
  path: () => string;
  pipe: () => Pipe<PipeValue>;
  start: () => void;
  stop: () => void;
};

export const createFileWatcher = (options: Options): FileWatcher => {
  const { path } = options;
  let { watch = false } = options;

  let exist = fs.existsSync(path);
  let info = exist ? fs.lstatSync(path) : null;
  let hash = exist ? readFileHashSync(path).hash : null;
  let pipe = createPipe<PipeValue>();

  const tick = async () => {
    exist = await fsPromise.existFile(path);

    if (exist) {
      if (hash && info) {
        const nextInfo = await fsPromise.lstat(path);

        if (info.mtimeMs !== nextInfo.mtimeMs) {
          info = nextInfo;

          const { hash: nextHash, file } = await readFileHash(path);

          if (hash !== nextHash) {
            hash = nextHash;
            pipe.resolve({ action: "changed", file });
          }
        }
      } else {
        const { hash: nextHash, file } = await readFileHash(path);

        info = fs.lstatSync(path);
        hash = nextHash;
        pipe.resolve({ action: "created", file });
      }
    } else if (hash) {
      hash = null;
      pipe.resolve({ action: "deleted", file: Buffer.alloc(0) });
    }

    if (watch) {
      await delay();
      process.nextTick(tick);
    }
  };

  const watcher: FileWatcher = {
    path: () => path,
    pipe: () => pipe,
    start: () => {
      watch = true;
      process.nextTick(tick);
    },
    stop: () => {
      watch = false;
    },
  };

  if (watch) {
    process.nextTick(tick);
  }

  return watcher;
};

export async function readFileHash(path: string) {
  const file = await fsPromise.readFile(path);

  return { file, hash: sha1(file) };
}

export function readFileHashSync(path: string) {
  const file = fs.readFileSync(path);

  return { file, hash: sha1(file) };
}

function delay(value: number = 100) {
  return new Promise((resolve) => setTimeout(resolve, value));
}
