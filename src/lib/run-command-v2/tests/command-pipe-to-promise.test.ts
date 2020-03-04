import { runCommandPipe, commandPipeToPromise } from "..";
import { commandOptions } from "./common";

test("main", async () => {
  const result = await commandPipeToPromise(
    runCommandPipe("bash", ["command.sh"], commandOptions),
  );

  expect(result).toEqual([{ value: "test\n", action: "data" }]);
});
