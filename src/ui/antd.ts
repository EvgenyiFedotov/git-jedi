import { List } from "antd";
import styled from "styled-components";
import { blue } from "@ant-design/colors";
import { Row } from "ui";

export const ListItem = styled(List.Item)`
  cursor: pointer;

  &:hover {
    background-color: ${blue[0]};
  }

  & > ${Row} {
    justify-content: space-between;
    width: 100%;
    padding: 0 8px;
  }
`;
