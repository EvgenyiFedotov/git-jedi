import { createFileWatcher } from "lib/file-watcher";
import { createFileConnector } from "lib/file-connector";
import * as ef from "effector";
import * as fsPromise from "lib/fs-promise";
import { createCommandEffect } from "lib/effector-extensions/command-effect";
import { createCommand } from "lib/create-command";

export type StageByPatchParams = {
  path: string;
  patch: string;
};

export const createStageByPatch = (_: {
  pathGitEditor: string;
  pathGitEditorMessage: string;
}) => {
  const { pathGitEditor, pathGitEditorMessage } = _;

  const watcher = createFileWatcher({ path: pathGitEditorMessage });
  const connector = createFileConnector({ watcher, id: "ustaged-connector" });

  const stageByPatch = createCommandEffect<StageByPatchParams>({
    command: async ({ options }) => {
      const configCoreEditor = await createCommand(
        "git",
        ["config", "core.editor"],
        options,
      )
        .run()
        .promise();
      const coreEditorValue = configCoreEditor.data()[0];

      const coreEditor =
        typeof coreEditorValue === "string"
          ? coreEditorValue.replace("\n", "")
          : "";

      watcher.start();

      await createCommand(
        "git",
        ["config", "core.editor", pathGitEditor],
        options,
      )
        .run()
        .promise();

      await createCommand("git", ["add", "-e"], options).run().promise();

      watcher.stop();

      return createCommand(
        "git",
        ["config", "core.editor", coreEditor],
        options,
      );
    },
  });

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
