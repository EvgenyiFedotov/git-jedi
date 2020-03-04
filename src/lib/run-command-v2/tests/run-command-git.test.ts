import { Pipe } from "lib/pipe-v2";

import { runCommandGit, runCommandPipe } from "../";
import { commandOptions, delay, cwd } from "./common";

test("init repo", async () => {
  runCommandPipe("mkdir", ["REPO"]);

  await delay();
  const pipe = runCommandGit("init", {
    spawnOptions: { cwd: "./REPO" },
  });

  await delay();
  const stream = getStream(pipe);
  expect(stream[stream.length - 1].value).toBe(0);

  runCommandPipe("rm", ["-fr", "REPO"]);
});

function getStream(pipe: Pipe<string | number>) {
  const stream = pipe.resolvedStore().get("stream");

  if (!stream) {
    throw new Error("Error get stream");
  }

  return stream;
}
