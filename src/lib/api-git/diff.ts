import { runCommandGit, RunCommandOptions } from "lib/run-command";
import { Change, diffWords } from "diff";
import { v4 as uuid } from "uuid";

export interface DiffOptions extends RunCommandOptions {
  commits?: string[];
  paths?: string[];
  cached?: boolean;
}

export const diff = (options: DiffOptions = {}) => {
  const args = createArgs(options);

  return runCommandGit("diff", args, options)
    .next(toFilesBlocks)
    .next(
      toDiffFiles({
        toDiffLines,
      }),
    )
    .next(toMapDiffFiles);
};

function createArgs(options: DiffOptions = {}) {
  const { commits = [], paths = [], cached = false } = options;

  return [
    // "--word-diff=porcelain",
    "--diff-algorithm=patience",
    cached ? "--cached" : "",
    ...commits,
    "--",
    ...paths,
  ].filter(Boolean);
}

function toFilesBlocks(stdout: string): string[] {
  return stdout.split("diff --git ").filter(Boolean);
}

export interface DiffFile<Lines> {
  info: DiffFileInfo;
  chunks: DiffFileChunk<Lines>[];
}

function toDiffFiles<Lines>(_: { toDiffLines: ToDiffLines<Lines> }) {
  const { toDiffLines } = _;
  const _toDiffFileChunk = toDiffFileChunk({ toDiffLines });

  return (filesBlocks: string[]): DiffFile<Lines>[] => {
    return filesBlocks.map((fileBlock) => {
      const [info, ...chunks] = fileBlock.split("\n@@");

      return {
        info: toDiffFileInfo(info),
        chunks: chunks.map(_toDiffFileChunk),
      };
    });
  };
}

function toMapDiffFiles<Lines>(
  diffFiles: DiffFile<Lines>[],
): Map<string, DiffFile<Lines>> {
  return diffFiles.reduce((memo, diffFile) => {
    memo.set(diffFile.info.path, diffFile);
    return memo;
  }, new Map());
}

export interface DiffFileInfo {
  path: string;
  pathA: string;
  pathB: string;
  meta: string;
  legend: string[];
}

function toDiffFileInfo(info: string): DiffFileInfo {
  const [paths, meta, ...legend] = info.split("\n");
  const [pathA, pathB] = paths.split(" ");

  return {
    path: pathA.slice(2),
    pathA,
    pathB,
    meta,
    legend,
  };
}

export interface DiffFileChunk<Lines> {
  id: string;
  header: DiffChunkHeader;
  lines: Lines;
}

type ToDiffLines<Lines> = (
  lines: string[],
  chunkHeader: DiffChunkHeader,
) => Lines;

function toDiffFileChunk<Lines>(_: { toDiffLines: ToDiffLines<Lines> }) {
  const { toDiffLines } = _;

  return (chunk: string): DiffFileChunk<Lines> => {
    const [header, ...lines] = chunk.split("\n");
    const diffHeader = toDiffChunkHeader(header.trim());

    return {
      id: uuid(),
      header: diffHeader,
      lines: toDiffLines(lines, diffHeader),
    };
  };
}

export interface DiffChunkHeader {
  meta: {
    remove: DiffChunkHeaderMeta;
    add: DiffChunkHeaderMeta;
  };
  title: string;
}

function toDiffChunkHeader(value: string): DiffChunkHeader {
  const [meta, title] = value.split(" @@ ");
  const [remove, add] = meta.split(" ");

  return {
    meta: {
      remove: toDiffChunkHeaderMeta(remove),
      add: toDiffChunkHeaderMeta(add),
    },
    title: title || "",
  };
}

export interface DiffChunkHeaderMeta {
  from: number;
  length: number;
}

function toDiffChunkHeaderMeta(meta: string): DiffChunkHeaderMeta {
  const [from, length] = meta.split(",");

  return { from: parseInt(from.slice(1), 10), length: parseInt(length, 10) };
}

export interface DiffLine {
  id: string;
  remove: string | null;
  removeNumLine: number | null;
  add: string | null;
  addNumLine: number | null;
  changed: boolean;
  diff: Change[];
}

function toDiffLines(lines: string[], diffHeader: DiffChunkHeader): DiffLine[] {
  const { meta } = diffHeader;
  let removeNumLine = meta.remove.from;
  let addNumLine = meta.add.from;
  const result: DiffLine[] = [
    {
      id: uuid(),
      remove: null,
      removeNumLine,
      add: null,
      addNumLine,
      changed: false,
      diff: [],
    },
  ];
  let indexBalance = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const action = line[0];

    switch (action) {
      case " ":
        result[result.length - 1].remove = line.slice(1);
        result[result.length - 1].add = line.slice(1);
        removeNumLine += 1;
        addNumLine += 1;
        indexBalance = 0;
        break;
      case "-":
        result[result.length - 1].remove = line.slice(1);
        result[result.length - 1].changed = true;
        removeNumLine += 1;
        indexBalance -= 1;
        break;
      case "+":
        const addedIndex = indexBalance < 0 ? indexBalance : 0;

        result[result.length - 1 + addedIndex].add = line.slice(1);
        result[result.length - 1 + addedIndex].changed = true;
        result[result.length - 1 + addedIndex].addNumLine = addNumLine;
        addNumLine += 1;
        break;
    }

    result.push({
      id: uuid(),
      remove: null,
      removeNumLine,
      add: null,
      addNumLine,
      changed: false,
      diff: [],
    });
  }

  return result.reduce<DiffLine[]>((memo, line) => {
    if (line.remove !== null || line.add !== null) {
      if (line.remove && line.add && line.changed) {
        line.diff = diffWords(line.remove, line.add);
      }

      memo.push(line);
    }
    return memo;
  }, []);
}

export function createPatchByDiffFile(
  diffFile: DiffFile<DiffLine[]>,
  ids: string[],
) {}
