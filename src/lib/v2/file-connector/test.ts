import "lib/crypto-polyfill";
import { createFileWatcher } from "lib/v2/file-watcher";
import * as fs from "fs";
import { v4 as uuid } from "uuid";

import { createFileConnector, Data } from "./index";

const path = `${__dirname}/TEST`;

test("connect", async () => {
  const watcher = await createFileWatcher({ path, watch: true });
  const connector1 = createFileConnector({ watcher, id: "connector-1" });
  const connector2 = createFileConnector({ watcher, id: "connector-2" });

  const callback = new Promise<Data>((resolve) => {
    connector1.watch(resolve);
  });
  const message = uuid();

  fs.writeFileSync(path, "");
  connector2.send(message);

  const result = await callback;

  expect(result.id).toBe("connector-2");
  expect(result.message).toBe(message);

  fs.unlinkSync(path);
});
