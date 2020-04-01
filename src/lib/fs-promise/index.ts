import * as fs from "fs";

export function existFile(path: string) {
  return new Promise<boolean>((resolve) => {
    fs.exists(path, (value) => resolve(value));
  });
}

export function readFile(path: string) {
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

export function writeFile(path: string, value: string) {
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

export function lstat(path: string) {
  return new Promise<fs.Stats>((resolve, reject) => {
    fs.lstat(path, (error, value) => {
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
    });
  });
}
