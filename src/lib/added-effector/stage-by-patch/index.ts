import { createPipePromiseEffect } from "lib/added-effector/create-pipe-promise-effect";
import { runCommandGit, commandPipeToPromise } from "lib/run-command";
import { createFileWatcher } from "lib/v2/file-watcher";
import { createFileConnector } from "lib/v2/file-connector";
import * as ef from "effector";
import * as fsPromise from "lib/v2/fs-promise";

export const createStageByPatch = (_: {
  pathGitEditor: string;
  pathGitEditorMessage: string;
}) => {
  const { pathGitEditor, pathGitEditorMessage } = _;

  const watcher = createFileWatcher({ path: pathGitEditorMessage });
  const connector = createFileConnector({ watcher, id: "ustaged-connector" });

  const stageByPatch = createPipePromiseEffect<{ patch: string }>(
    async (_, options) => {
      const configCoreEditor = await commandPipeToPromise(
        runCommandGit("config", ["core.editor"], options),
      );
      const coreEditor = configCoreEditor[0].value.replace("\n", "");

      watcher.start();

      await commandPipeToPromise(
        runCommandGit("config", ["core.editor", pathGitEditor], options),
      );

      await commandPipeToPromise(runCommandGit("add", ["-e"], options));

      watcher.stop();

      return runCommandGit("config", ["core.editor", coreEditor], options);
    },
  );

  const edit = ef.createEvent<string>();

  const $patch = ef.createStore<string>("");

  ef.forward({
    from: stageByPatch.map(({ params }) => params.patch),
    to: $patch,
  });

  ef.forward({
    from: stageByPatch.finally.map(() => ""),
    to: $patch,
  });

  ef.sample({
    source: $patch,
    clock: edit,
    fn: (patch, path) => ({ patch, path }),
  }).watch(async ({ patch, path }) => {
    await fsPromise.writeFile(path, patch);
    connector.send({ success: true });
  });

  connector.watch(({ message }) => {
    const [, , path] = message.paths;

    edit(path);
  });

  return stageByPatch;
};
