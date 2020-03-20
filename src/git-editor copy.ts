import { createFileWatcher } from "lib/file-watcher";
import { createFileConnector } from "lib/file-connector";
import path from "path";

const args = process.argv;
const watcher = createFileWatcher(`${path.dirname(args[0])}/REBASE_STATE`);
const connector = createFileConnector({ fileWatcher: watcher, id: "editor" });

async function main() {
  await new Promise((resolve) => {
    connector.send([...args, Math.random()]);
    connector.onMessage(resolve);
  });
  watcher.stop();
}

main();
