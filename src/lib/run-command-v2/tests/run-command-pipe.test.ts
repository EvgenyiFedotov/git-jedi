import { runCommandPipe } from "../run-command-pipe";
import { commandOptions, delay } from "./common";

test("main", async () => {
  const commandPipe = runCommandPipe("bash", ["command.sh"], commandOptions);

  await delay(400);

  expect(commandPipe.resolvedStore().get("stream")).toEqual([
    { action: "data", value: "test\n" },
    { action: "close", value: 0 },
  ]);
});
