import * as React from "react";
import { Branch } from "lib/branch";

import {
  Container,
  Lines,
  CodeLines,
  HeaderLine,
  CodeLine as CodeLineUi,
} from "./ui";

export { CodeLineChunk, CodeLine as CodeLineUi } from "./ui";

interface Props {
  infoLines: React.ReactElement[];
  codeLines: React.ReactElement[];
}

export const DiffFile: React.FC<Props> = (props) => {
  const { infoLines, codeLines } = props;

  return (
    <Container>
      <Branch if={!!infoLines.length}>
        <Lines>
          <tbody>{infoLines}</tbody>
        </Lines>
      </Branch>
      <CodeLines>
        <tbody>{codeLines}</tbody>
      </CodeLines>
    </Container>
  );
};

export const ChunkHeaderLine: React.FC<{ type?: "title" }> = (props) => {
  return (
    <HeaderLine>
      <td data-type={props.type}>{props.children}</td>
    </HeaderLine>
  );
};

export const InfoLine: React.FC = (props) => {
  return (
    <tr>
      <td>{props.children}</td>
    </tr>
  );
};

export const CodeLine: React.FC<{ bgColor?: string }> = (props) => {
  return (
    <CodeLineUi bgColor={props.bgColor}>
      <td>{props.children}</td>
    </CodeLineUi>
  );
};

export const Separator: React.FC = () => (
  <tr>
    <td></td>
  </tr>
);
