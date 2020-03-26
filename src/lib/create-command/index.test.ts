import "lib/crypto-polyfill";

import { createCommand } from ".";

const cwd = "./src/lib/create-command/";

const commandOptions = {
  spawnOptions: { cwd },
};

function delay(ms: number = 100) {
  return new Promise((res) => setTimeout(res, ms));
}

test("pipe", async () => {
  const pipe = createCommand("bash", ["command.sh"], commandOptions)
    .run()
    .pipe();

  pipe.listen((value) => value, "stream");

  await delay(400);

  expect(pipe.resolvedStore().get("stream")).toEqual([
    { action: "data", value: "test\n" },
    { action: "close", value: 0 },
  ]);
});

test("promise", async () => {
  const promise = createCommand("bash", ["command.sh"], commandOptions)
    .run()
    .promise();

  const result = await promise;

  expect(result.all()).toEqual([
    { action: "data", value: "test\n" },
    { action: "close", value: 0 },
  ]);
  expect(result.data()).toEqual(["test\n"]);
  expect(result.close()).toEqual(0);
});
