import { createFileWatcher, PipeValue } from "./index";
import { writeFileSync, unlinkSync } from "fs";
import { v4 as uuid } from "uuid";

const path = `${__dirname}/TEST`;

test("file created", async () => {
  const watcher = await createFileWatcher({ path, watch: true });

  const change = new Promise<PipeValue>((resolve) =>
    watcher.pipe().listen(resolve),
  );

  const content = uuid();
  writeFileSync(path, content);

  const { file, action } = await change;

  expect(file.toString()).toBe(content);
  expect(action).toBe("created");
});

test("file changed", async () => {
  const watcher = await createFileWatcher({ path, watch: true });

  const change = new Promise<PipeValue>((resolve) =>
    watcher.pipe().listen(resolve),
  );

  const content = uuid();
  writeFileSync(path, content);

  const { file, action } = await change;

  expect(file.toString()).toBe(content);
  expect(action).toBe("changed");
});

test("file deleted", async () => {
  const watcher = await createFileWatcher({ path, watch: true });

  const change = new Promise<PipeValue>((resolve) =>
    watcher.pipe().listen(resolve),
  );

  unlinkSync(path);

  const { file, action } = await change;

  expect(file.toString()).toBe("");
  expect(action).toBe("deleted");
});
