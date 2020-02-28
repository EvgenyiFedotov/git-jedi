import * as React from "react";
import styled from "styled-components";
import mousetrap from "mousetrap";
import { useStore } from "effector-react";
import { Branch } from "lib/branch";
import { grey } from "@ant-design/colors";

import { $isShowTooltips, hideTooltips } from "./model";

interface Props<T> {
  title: string;
  command: string;
  bindRef: React.RefObject<T>;
  children: React.ReactChild;
  action: "focus" | "click";
  top?: string;
  offsetTop?: string;
  left?: string;
  offsetLeft?: string;
}

export function HotKey<T extends { click?: () => void; focus?: () => void }>(
  props: Props<T>,
): React.ReactElement {
  const { command, bindRef, action } = props;

  const isShowTooltips = useStore($isShowTooltips);

  React.useEffect(() => {
    mousetrap.bind(command, () => {
      if (bindRef.current) {
        if (action === "focus" && bindRef.current.focus) {
          bindRef.current.focus();
        } else if (action === "click" && bindRef.current.click) {
          bindRef.current.click();
        }
      }

      hideTooltips();
    });

    return () => {
      mousetrap.unbind(command);
    };
  }, [command, bindRef, action]);

  return (
    <Container>
      <Branch if={isShowTooltips}>
        <Title
          top={props.top}
          offsetTop={props.offsetTop}
          left={props.left}
          offsetLeft={props.offsetLeft}
        >
          {props.title}
        </Title>
      </Branch>
      <>{props.children}</>
    </Container>
  );
}

const Container = styled.span`
  position: relative;
`;

const Title = styled.div<{
  top?: string;
  offsetTop?: string;
  left?: string;
  offsetLeft?: string;
}>`
  z-index: 1000;
  position: absolute;
  top: ${({ top }) => (top ? top : "")};
  bottom: ${({ top, offsetTop = "0px" }) =>
    top ? "" : `calc(100% + ${offsetTop})`};
  left: ${({ left = "0px", offsetLeft = "0px" }) =>
    `calc(${left} + ${offsetLeft})`};
  padding: 1px 2px;
  border: 1px solid #fafafa;
  background-color: white;
  color: ${grey[2]};
  font-size: 8px;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: 0px 2px 2px 0 hsla(0, 0%, 0%, 0.2);
`;
