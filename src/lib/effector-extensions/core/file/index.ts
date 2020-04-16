import * as ef from "effector";
import { existFile, readFile, writeFile } from "lib/fs-promise";

export function createFile(path: string) {
  const read = ef.createEffect<void, string | null>();
  const write = ef.createEffect<string, void>();

  const $file = ef.createStore<string | null>(null);

  read.use(async () => {
    if (await existFile(path)) {
      return (await readFile(path)).toString();
    }

    return null;
  });

  write.use(async (content) => {
    await writeFile(path, content);
  });

  $file.on(read.done, (_, { result }) => result);

  return { read, write, $file };
}
