import * as React from "react";
import { DiffFile, DiffLine, DiffFileChunk } from "lib/api-git";
import {
  ChunkHeaderLine,
  Separator,
  CodeLine,
  CodeLineChunk,
  InfoLine,
} from "ui/diff-file";
import { cyan, red } from "@ant-design/colors";
import { Icon, Tooltip } from "antd";
import { changeStageChunk, getHeaderChunk } from "features/state-git";
import { Branch } from "lib/branch";

import { NumLine, ButtonAdd } from "./ui";

interface DiffFileToElementsResult {
  remove: { infoLines: React.ReactElement[]; codeLines: React.ReactElement[] };
  add: { infoLines: React.ReactElement[]; codeLines: React.ReactElement[] };
}

interface Options {
  reverse?: boolean;
  showButtonChangeStage?: boolean;
}

export const getDiffFileToElements = (
  diffFile: DiffFile<DiffLine[]> | null,
  options: Options = {},
): DiffFileToElementsResult => {
  const def = {
    remove: { infoLines: [], codeLines: [] },
    add: { infoLines: [], codeLines: [] },
  };

  if (!diffFile) return def;

  return diffFile.chunks.reduce<DiffFileToElementsResult>((memo, chunk) => {
    addHeaders(memo, chunk, {
      diffFile,
      reverse: options.reverse,
      showButtonChangeStage: options.showButtonChangeStage,
    });
    addMainLines(memo, chunk);
    addSeparators(memo, chunk);

    return memo;
  }, def);
};

const addHeaders = (
  { remove, add }: DiffFileToElementsResult,
  chunk: DiffFileChunk<DiffLine[]>,
  {
    diffFile,
    reverse,
    showButtonChangeStage = true,
  }: {
    diffFile: DiffFile<DiffLine[]>;
    reverse?: boolean;
    showButtonChangeStage?: boolean;
  },
) => {
  const headerChunk = getHeaderChunk(chunk.header);

  remove.infoLines.push(
    <ChunkHeaderLine key={`header-${chunk.id}`}>
      <Branch if={showButtonChangeStage}>
        <ButtonAdd>
          <Tooltip title={`${reverse ? "Unstage" : "Stage"} chunk`}>
            <Icon
              type={reverse ? "minus" : "plus"}
              onClick={() => changeStageChunk({ chunk, diffFile, reverse })}
            />
          </Tooltip>
        </ButtonAdd>
      </Branch>
    </ChunkHeaderLine>,
  );
  remove.codeLines.push(
    <ChunkHeaderLine key={`header-${chunk.id}`} type="title">
      {headerChunk}
    </ChunkHeaderLine>,
  );

  add.infoLines.push(
    <ChunkHeaderLine key={`header-${chunk.id}`}></ChunkHeaderLine>,
  );
  add.codeLines.push(
    <ChunkHeaderLine key={`header-${chunk.id}`} type="title">
      {headerChunk}
    </ChunkHeaderLine>,
  );
};

const addMainLines = (
  { remove, add }: DiffFileToElementsResult,
  { lines }: DiffFileChunk<DiffLine[]>,
) => {
  lines.forEach((diffLine) => {
    const changes = getChanges(diffLine);

    remove.infoLines.push(
      <InfoLine key={diffLine.id}>
        <NumLine>
          {diffLine.remove === null ? "" : diffLine.removeNumLine}
        </NumLine>
      </InfoLine>,
    );
    remove.codeLines.push(
      <CodeLine key={diffLine.id} bgColor={getBgColorRemove(diffLine)}>
        {changes.remove.length ? changes.remove : diffLine.remove}
      </CodeLine>,
    );

    add.infoLines.push(
      <InfoLine key={diffLine.id}>
        <NumLine>{diffLine.add === null ? "" : diffLine.addNumLine}</NumLine>
      </InfoLine>,
    );
    add.codeLines.push(
      <CodeLine key={diffLine.id} bgColor={getBgColorAdd(diffLine)}>
        {changes.add.length ? changes.add : diffLine.add}
      </CodeLine>,
    );
  });
};

export interface GetChangesResult {
  remove: React.ReactElement[];
  add: React.ReactElement[];
}

const getChanges = (diffLine: DiffLine): GetChangesResult => {
  const def = {
    remove: [],
    add: [],
  };

  return diffLine.diff.reduce<GetChangesResult>((memo, change, index) => {
    const key = `${diffLine.id}-${index}`;

    if (!change.removed && !change.added) {
      const element = <React.Fragment key={key}>{change.value}</React.Fragment>;

      memo.remove.push(element);
      memo.add.push(element);
    } else if (change.removed) {
      memo.remove.push(
        <CodeLineChunk key={key} bgColor={red[1]}>
          {change.value}
        </CodeLineChunk>,
      );
    } else if (change.added) {
      memo.add.push(
        <CodeLineChunk key={key} bgColor={cyan[1]}>
          {change.value}
        </CodeLineChunk>,
      );
    }

    return memo;
  }, def);
};

const addSeparators = (
  { remove, add }: DiffFileToElementsResult,
  chunk: DiffFileChunk<DiffLine[]>,
) => {
  remove.infoLines.push(<Separator key={`separator-${chunk.id}`} />);
  remove.codeLines.push(<Separator key={`separator-${chunk.id}`} />);

  add.infoLines.push(<Separator key={`separator-${chunk.id}`} />);
  add.codeLines.push(<Separator key={`separator-${chunk.id}`} />);
};

const getBgColorRemove = (diffLine: DiffLine) => {
  return diffLine.remove && diffLine.changed ? red[0] : undefined;
};

const getBgColorAdd = (diffLine: DiffLine) => {
  return diffLine.add && diffLine.changed ? cyan[0] : undefined;
};
