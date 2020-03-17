import * as React from "react";
import { Row, RowBase, Column } from "ui";
import * as diffModel from "features/v2/diff/model";
import styled from "styled-components";
import { cyan, red, grey, geekblue } from "@ant-design/colors";
import { Branch } from "lib/branch";
import { PlusOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { Change } from "diff";

export const DiffFile: React.FC<{ diffFile: diffModel.DiffFile }> = ({
  diffFile,
}) => {
  return (
    <Column>
      {diffFile.chunks.map((diffChunk) => (
        <DiffChunk key={diffChunk.id} diffChunk={diffChunk} />
      ))}
    </Column>
  );
};

const DiffChunk: React.FC<{ diffChunk: diffModel.DiffChunk }> = ({
  diffChunk,
}) => {
  return (
    <DiffChunkContainer>
      <Buttons diffChunk={diffChunk} />
      <NumLines diffChunk={diffChunk} />
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

const Buttons: React.FC<{ diffChunk: diffModel.DiffChunk }> = () => {
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

const NumLines: React.FC<{ diffChunk: diffModel.DiffChunk }> = ({
  diffChunk,
}) => {
  const { scopeLines } = diffChunk;

  return (
    <NumLinesTable>
      <tbody>
        <HeaderTr>
          <td></td>
          <td>
            <Tooltip title="stage chunk">
              <ButtonPlus>
                <PlusOutlined />
              </ButtonPlus>
            </Tooltip>
          </td>
        </HeaderTr>
        {scopeLines.map((scopeLine) => (
          <tr key={scopeLine.id}>
            <td>
              <Branch if={!!scopeLine.removedNumLine}>
                <>{scopeLine.removedNumLine}</>
                <Tooltip title="stage line">
                  <ButtonPlus>
                    <PlusOutlined />
                  </ButtonPlus>
                </Tooltip>
              </Branch>
            </td>
            <td>
              <Branch if={!!scopeLine.addedNumLine}>
                <>{scopeLine.addedNumLine}</>
                <Tooltip title="stage line">
                  <ButtonPlus>
                    <PlusOutlined />
                  </ButtonPlus>
                </Tooltip>
              </Branch>
            </td>
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

const Lines: React.FC<{ diffChunk: diffModel.DiffChunk }> = ({ diffChunk }) => {
  const { header, scopeLines } = diffChunk;

  const lines = scopeLines.map((scopeLine) => (
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
`;

const LineTd: React.FC<{ scopeLine: diffModel.ScopeLine }> = ({
  scopeLine,
}) => {
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

const LineTdContainer = styled.td<{ scopeLine: diffModel.ScopeLine }>`
  background-color: ${({ scopeLine }) => getColorLine(scopeLine)[0]};
`;

const LineChunk = styled.span<{ scopeLine: diffModel.ScopeLine }>`
  background-color: ${({ scopeLine }) => getColorLine(scopeLine)[1]};
`;

function getColorLine({ removedNumLine, addedNumLine }: diffModel.ScopeLine) {
  if (removedNumLine !== null && addedNumLine !== null) {
    return [];
  } else if (removedNumLine !== null) {
    return red;
  } else if (addedNumLine !== null) {
    return cyan;
  }

  return [];
}
