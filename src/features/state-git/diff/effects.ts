import { createEffect } from "effector";
import {
  DiffOptions,
  DiffFile,
  DiffLine,
  diff as diffGit,
  DiffFileChunk,
  DiffChunkHeader,
} from "lib/api-git";
import { pipeToPromise } from "lib/pipe-to-promise";

import { DiffFileParams, getDiffFile } from "./events";

export const diff = createEffect<
  DiffOptions,
  Map<string, DiffFile<DiffLine[]>>[]
>({
  handler: (options) => pipeToPromise(diffGit(options)),
});

export const updateDiff = createEffect<Map<string, DiffFileParams>, void>({
  handler: async (params) => {
    params.forEach((getDiffFileParams) => getDiffFile(getDiffFileParams));
  },
});

export const createPatchByChunk = createEffect<
  { chunk: DiffFileChunk<DiffLine[]>; diffFile: DiffFile<DiffLine[]> },
  string
>({
  handler: async ({ chunk, diffFile }) => {
    let lines: string[] = [];
    let removeLines: string[] = [];
    let addLines: string[] = [];

    for (let index = 0; index < chunk.lines.length; index += 1) {
      const line = chunk.lines[index];

      if (line.changed) {
        if (line.remove) {
          removeLines.push(`-${line.remove}`);
        }
        if (line.add) {
          addLines.push(`+${line.add}`);
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

    const result = [
      `diff --git ${diffFile.info.pathA} ${diffFile.info.pathB}`,
      diffFile.info.meta,
      ...diffFile.info.legend,
      getHeaderChunk(chunk.header),
      ...lines,
    ];

    return result.join("\n");
  },
});

createPatchByChunk.done.watch(({ result }) => console.log(result));

export const getHeaderChunk = (diffHeader: DiffChunkHeader) => {
  const { meta, title } = diffHeader;
  const { remove, add } = meta;

  return `@@ -${remove.from},${remove.length} +${add.from},${add.length} @@ ${title}`;
};
