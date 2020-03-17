import * as fs from "fs";
import { sha1 } from "object-hash";
import { Pipe, createPipe } from "lib/pipe";

export type Options = {
  path: string;
  watch?: boolean;
};
export type PipeValue = {
  action: "created" | "changed" | "deleted";
  file: Buffer;
};
export type FileWatcher = {
  pipe: () => Pipe<PipeValue>;
  start: () => void;
  stop: () => void;
};

export const createFileWatcher = (options: Options): FileWatcher => {
  const { path } = options;
  let { watch = false } = options;

  const exist = fs.existsSync(path);
  let info = exist ? fs.lstatSync(path) : null;
  let hash = exist ? readFileHashSync(path).hash : null;
  let pipe = createPipe<PipeValue>();

  const tick = () => {
    if (fs.existsSync(path)) {
      if (hash && info) {
        const nextInfo = fs.lstatSync(path);

        if (info.mtimeMs !== nextInfo.mtimeMs) {
          info = nextInfo;

          const { hash: nextHash, file } = readFileHashSync(path);

          if (hash !== nextHash) {
            hash = nextHash;
            pipe.resolve({ action: "changed", file });
          }
        }
      } else {
        const { hash: nextHash, file } = readFileHashSync(path);

        info = fs.lstatSync(path);
        hash = nextHash;
        pipe.resolve({ action: "created", file });
      }
    } else if (hash) {
      hash = null;
      pipe.resolve({ action: "deleted", file: Buffer.alloc(0) });
    }

    if (watch) {
      delay().then(() => process.nextTick(tick));
    }
  };

  const watcher: FileWatcher = {
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

function readFileHashSync(path: string) {
  const file = fs.readFileSync(path);

  return { file, hash: sha1(file) };
}

function delay(value: number = 100) {
  return new Promise((resolve) => setTimeout(resolve, value));
}
