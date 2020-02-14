import * as fs from "fs";
import { sha1 } from "object-hash";
import { createPipe } from "lib/pipe";

export const createFileWatcher = (path: string) => {
  const checkHash = updateHashFile();
  const pipe = createPipe<Buffer>();

  const nextTick = () => {
    existFile(path)
      .then(async (value) => {
        if (value) {
          const data = await readFile(path);
          const isChanged = checkHash(data);

          if (isChanged) {
            pipe.resolve(data);
          }
        }
      })
      .then(delay())
      .then(() => process.nextTick(nextTick));
  };

  process.nextTick(nextTick);

  return pipe;
};

function existFile(path: string) {
  return new Promise((resolve) => {
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

function updateHashFile() {
  let prevHashFile = "";

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
