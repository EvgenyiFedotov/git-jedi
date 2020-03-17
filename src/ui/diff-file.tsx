import * as React from "react";
import { RowBase, Column } from "ui";
import styled from "styled-components";
import { cyan, red, grey, geekblue } from "@ant-design/colors";
import { Branch } from "lib/branch";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import * as diff from "lib/diff";

export const DiffFile: React.FC<{
  diffFile: diff.DiffFile;
  status: "stage" | "unstage";
  onClickChunk?: (diffChunk: diff.DiffChunk) => void;
  onClickLine?: (diffLine: diff.DiffLine) => void;
}> = ({ diffFile, status, onClickChunk, onClickLine }) => {
  return (
    <DiffFileContainer>
      {diffFile.chunks.map((diffChunk) => (
        <DiffChunk
          key={diffChunk.id}
          diffChunk={diffChunk}
          status={status}
          onClickChunk={onClickChunk}
          onClickLine={onClickLine}
        />
      ))}
    </DiffFileContainer>
  );
};

const DiffFileContainer = styled(Column)`
  width: 100%;
`;

const DiffChunk: React.FC<{
  diffChunk: diff.DiffChunk;
  status: "stage" | "unstage";
  onClickChunk?: (diffChunk: diff.DiffChunk) => void;
  onClickLine?: (diffLine: diff.DiffLine) => void;
}> = ({ diffChunk, status, onClickChunk, onClickLine }) => {
  return (
    <DiffChunkContainer>
      <Buttons diffChunk={diffChunk} />
      <NumLines
        diffChunk={diffChunk}
        status={status}
        onClickChunk={onClickChunk}
        onClickLine={onClickLine}
      />
      <Lines diffChunk={diffChunk} />
    </DiffChunkContainer>
  );
};

const DiffChunkContainer = styled(RowBase)`
  flex-wrap: nowrap;
  position: relative;
  overflow: hidden;
  align-items: flex-start;
`;

const Buttons: React.FC<{ diffChunk: diff.DiffChunk }> = () => {
  return <DiffTable></DiffTable>;
};

const DiffTable = styled.table`
  font-size: 12px;
  font-family: monospace;

  & > tbody > tr {
    height: 24px;
    white-space: pre;

    & > td {
      padding: 0 4px;
    }
  }
`;

const HeaderTr = styled.tr`
  background-color: ${geekblue[0]};
`;

const NumLines: React.FC<{
  diffChunk: diff.DiffChunk;
  status: "stage" | "unstage";
  onClickChunk?: (diffChunk: diff.DiffChunk) => void;
  onClickLine?: (diffLine: diff.DiffLine) => void;
}> = ({
  diffChunk,
  status,
  onClickChunk = () => {},
  onClickLine = () => {},
}) => {
  const { lines: scopeLines } = diffChunk;

  return (
    <NumLinesTable>
      <tbody>
        <HeaderTr>
          <td></td>
          <td>
            <Branch if={status === "stage"}>
              <Tooltip title="unstage chunk" mouseEnterDelay={1.5}>
                <ButtonPlus>
                  <MinusOutlined />
                </ButtonPlus>
              </Tooltip>
              <Tooltip title="stage chunk" mouseEnterDelay={1.5}>
                <ButtonPlus onClick={() => onClickChunk(diffChunk)}>
                  <PlusOutlined />
                </ButtonPlus>
              </Tooltip>
            </Branch>
          </td>
        </HeaderTr>
        {scopeLines.map((scopeLine) => (
          <tr key={scopeLine.id}>
            <Branch if={status === "stage"}>
              <>
                <td>
                  <Branch if={!!scopeLine.removedNumLine}>
                    <>{scopeLine.removedNumLine}</>
                    <Tooltip title="unstage line">
                      <ButtonPlus>
                        <MinusOutlined />
                      </ButtonPlus>
                    </Tooltip>
                  </Branch>
                </td>
                <td>
                  <Branch if={!!scopeLine.addedNumLine}>
                    <>{scopeLine.addedNumLine}</>
                    <Tooltip title="unstage line">
                      <ButtonPlus>
                        <MinusOutlined />
                      </ButtonPlus>
                    </Tooltip>
                  </Branch>
                </td>
              </>
              <>
                <td>
                  <Branch if={!!scopeLine.removedNumLine}>
                    <>{scopeLine.removedNumLine}</>
                    <Tooltip title="stage line" mouseEnterDelay={1.5}>
                      <ButtonPlus onClick={() => onClickLine(scopeLine)}>
                        <PlusOutlined />
                      </ButtonPlus>
                    </Tooltip>
                  </Branch>
                </td>
                <td>
                  <Branch if={!!scopeLine.addedNumLine}>
                    <>{scopeLine.addedNumLine}</>
                    <Tooltip title="stage line" mouseEnterDelay={1.5}>
                      <ButtonPlus onClick={() => onClickLine(scopeLine)}>
                        <PlusOutlined />
                      </ButtonPlus>
                    </Tooltip>
                  </Branch>
                </td>
              </>
            </Branch>
          </tr>
        ))}
      </tbody>
    </NumLinesTable>
  );
};

const ButtonPlus = styled.div`
  cursor: pointer;
`;

const NumLinesTable = styled(DiffTable)`
  & > tbody > tr {
    font-size: 10px;
    color: ${grey[3]};

    & > td {
      text-align: center;
    }
  }
`;

const Lines: React.FC<{ diffChunk: diff.DiffChunk }> = ({ diffChunk }) => {
  const { header } = diffChunk;

  const lines = diffChunk.lines.map((scopeLine) => (
    <LineTd key={scopeLine.id} scopeLine={scopeLine} />
  ));

  return (
    <LinesContainer>
      <DiffTable>
        <tbody>
          <HeaderTr>
            <td>
              <b>{header}</b>
            </td>
          </HeaderTr>
          {lines}
        </tbody>
      </DiffTable>
    </LinesContainer>
  );
};

const LinesContainer = styled.div`
  overflow-x: auto;
  width: 100%;

  & > table {
    width: 100%;
  }
`;

const LineTd: React.FC<{ scopeLine: diff.DiffLine }> = ({ scopeLine }) => {
  const content = React.useMemo(() => {
    if (scopeLine.diff) {
      if (scopeLine.removedNumLine !== null) {
        return scopeLine.diff
          .filter(({ removed, added }) => (!removed && !added) || removed)
          .map(({ value, removed }, index) =>
            removed ? (
              <LineChunk key={`${value}-${index}`} scopeLine={scopeLine}>
                {value}
              </LineChunk>
            ) : (
              <span key={`${value}-${index}`}>{value}</span>
            ),
          );
      } else if (scopeLine.addedNumLine !== null) {
        return scopeLine.diff
          .filter(({ removed, added }) => (!removed && !added) || added)
          .map(({ value, added }, index) =>
            added ? (
              <LineChunk key={`${value}-${index}`} scopeLine={scopeLine}>
                {value}
              </LineChunk>
            ) : (
              <span key={`${value}-${index}`}>{value}</span>
            ),
          );
      }
    }

    return scopeLine.line;
  }, [scopeLine]);

  return (
    <tr>
      <LineTdContainer scopeLine={scopeLine}>{content}</LineTdContainer>
    </tr>
  );
};

const LineTdContainer = styled.td<{ scopeLine: diff.DiffLine }>`
  background-color: ${({ scopeLine }) => getColorLine(scopeLine)[0]};
`;

const LineChunk = styled.span<{ scopeLine: diff.DiffLine }>`
  background-color: ${({ scopeLine }) => getColorLine(scopeLine)[1]};
`;

function getColorLine({ removedNumLine, addedNumLine }: diff.DiffLine) {
  if (removedNumLine !== null && addedNumLine !== null) {
    return [];
  } else if (removedNumLine !== null) {
    return red;
  } else if (addedNumLine !== null) {
    return cyan;
  }

  return [];
}
