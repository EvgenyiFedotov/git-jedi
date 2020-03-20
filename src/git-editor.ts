import path from "path";
import { createFileWatcher } from "lib/v2/file-watcher";
import { createFileConnector } from "lib/v2/file-connector";

const args = process.argv;
const PATH_EDITOR_MESSAGE = `${path.dirname(args[0])}/GIT_EDITOR_MESSAGE`;

let watcher = createFileWatcher({ path: PATH_EDITOR_MESSAGE });
let connector = createFileConnector({ watcher, id: "editor" });

async function main() {
  watcher.start();

  await new Promise((resolve) => {
    connector.send({ paths: args, random: Math.random() });
    connector.watch(resolve);
  });

  watcher.stop();
}

main();
