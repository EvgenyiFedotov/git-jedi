import { diffWords } from "diff";
import { v4 as uuid } from "uuid";

import { DiffFile, DiffChunk, ScopeLine } from "./model";

export function parseFile(value: string): DiffFile {
  const [info, ...chunks] = value.split("\n@@");
  const [pathA] = info.split(" ");

  return {
    path: pathA.slice(2),
    info: `diff --git ${info}`,
    chunks: chunks.map(parseChunk),
  };
}

export function parseChunk(value: string): DiffChunk {
  const [header, ...lines] = value.split("\n");

  lines.pop();

  const scopeLines = buildScopeLines(lines, parseHeader(header));

  return { id: uuid(), header: `@@${header}`, lines, scopeLines };
}

type HeaderChunk = {
  removedRow: number;
  addedRow: number;
};

export function parseHeader(value: string): HeaderChunk {
  const [remove, add] = value
    .split(" @@")[0]
    .trim()
    .split(" ")
    .map((value) => value.trim());

  return {
    removedRow: parseInt(remove.split(",")[0], 10) * -1,
    addedRow: parseInt(add.split(",")[0], 10),
  };
}

export function buildScopeLines(
  lines: string[],
  header: HeaderChunk,
): ScopeLine[] {
  let removedRow = header.removedRow;
  let addedRow = header.addedRow;
  let removedIndex = 0;
  let addedIndex = 0;
  const scope: ScopeLine[] = [];
  let stackLines: ScopeLine[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const action = toLineAction(line[0]);
    let removedNumLine = null;
    let addedNumLine = null;

    if (action === null) {
      removedNumLine = removedRow + removedIndex;
      addedNumLine = addedRow + addedIndex;
      removedIndex += 1;
      addedIndex += 1;
    } else if (action === "removed") {
      removedNumLine = removedRow + removedIndex;
      removedIndex += 1;
    } else if (action === "added") {
      addedNumLine = addedRow + addedIndex;
      addedIndex += 1;
    }

    const scopeLine: ScopeLine = {
      id: uuid(),
      action,
      line: line.slice(1),
      removedNumLine,
      addedNumLine,
      diff: null,
    };

    scope.push(scopeLine);

    if (action === null) {
      stackLines = [];
    } else if (action === "removed") {
      stackLines.push(scopeLine);
    } else if (action === "added" && stackLines[0]) {
      const diff = diffWords(stackLines[0].line, scopeLine.line);

      stackLines[0].diff = diff;
      scopeLine.diff = diff;

      stackLines.shift();
    }
  }

  return scope;
}

function toLineAction(value: string) {
  switch (value) {
    case "-":
      return "removed";
    case "+":
      return "added";
    default:
      return null;
  }
}
