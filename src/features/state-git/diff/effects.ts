import { createEffect } from "effector";
import {
  DiffOptions,
  DiffFile,
  DiffLine,
  diff as diffGit,
  DiffChunkHeader,
  add,
  AddOptions,
} from "lib/api-git";
import { pipeToPromise } from "lib/pipe-to-promise";
import { writeFileSync } from "fs";

import { DiffFileParams, getDiffFile, ChangeStageChunk } from "./events";
import { changeCoreEditor, backCoreEditor, fileConnector } from "../editor";

export const diff = createEffect<
  DiffOptions,
  Map<string, DiffFile<DiffLine[]>>[]
>({
  handler: async (options) => {
    await pipeToPromise(
      add({
        commandOptions: options.commandOptions,
        spawnOptions: options.spawnOptions,
        paths: options.paths,
        intentToAdd: true,
      }),
    );

    const result = await pipeToPromise(diffGit(options));

    return result;
  },
});

export const updateDiff = createEffect<Map<string, DiffFileParams>, void>({
  handler: async (params) => {
    params.forEach((getDiffFileParams) => getDiffFile(getDiffFileParams));
  },
});

export const createPatchByChunk = createEffect<ChangeStageChunk, string>({
  handler: async ({ chunk, diffFile, reverse }) => {
    let lines: string[] = [];
    let removeLines: string[] = [];
    let addLines: string[] = [];

    for (let index = 0; index < chunk.lines.length; index += 1) {
      const line = chunk.lines[index];

      if (line.changed) {
        if (line.remove !== null) {
          const char = reverse ? "+" : "-";

          removeLines.push(`${char}${line.remove}`);
        }
        if (line.add !== null) {
          const char = reverse ? "-" : "+";

          addLines.push(`${char}${line.add}`);
        }
      } else {
        if (removeLines.length) {
          lines = [...lines, ...removeLines];
          removeLines = [];
        }
        if (addLines.length) {
          lines = [...lines, ...addLines];
          addLines = [];
        }
        lines.push(` ${line.remove}` || " ");
      }
    }

    lines = [...lines, ...removeLines, ...addLines];

    const result = [
      `diff --git ${diffFile.info.pathA} ${diffFile.info.pathB}`,
      diffFile.info.meta,
      ...diffFile.info.legend,
      getHeaderChunk(chunk.header),
      ...lines,
      "",
    ];

    return result.join("\n");
  },
});

export const addChunk = createEffect<AddOptions, void>({
  handler: async (options) => {
    await changeCoreEditor({
      commandOptions: options.commandOptions,
      spawnOptions: options.spawnOptions,
    });

    await pipeToPromise(add({ ...options, edit: true }));

    await backCoreEditor({
      commandOptions: options.commandOptions,
      spawnOptions: options.spawnOptions,
    });
  },
});

export const writeAddEditFile = createEffect<
  { content: string; pathFile: string },
  void
>({
  handler: async ({ content, pathFile }) => {
    writeFileSync(pathFile, content);
    fileConnector.send(content);
  },
});

export const getHeaderChunk = (diffHeader: DiffChunkHeader) => {
  const { meta, title } = diffHeader;
  const { remove, add } = meta;

  return `@@ -${remove.from},${remove.length} +${add.from},${add.length} @@ ${title}`;
};
