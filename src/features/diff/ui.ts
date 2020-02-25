import styled from "styled-components";
import { grey } from "@ant-design/colors";
import { Row } from "ui";

export const NumLine = styled.span<{ bgColor?: string }>`
  color: ${grey[0]};
  text-align: right;
  background-color: ${({ bgColor }) => bgColor};
`;

export const ButtonAdd = styled(Row)`
  justify-content: center;
  align-items: center;
  cursor: pointer;
  min-height: 21px;
`;
