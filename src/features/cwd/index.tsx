import * as React from "react";
import { useStore } from "effector-react";
import { $settings, selectCwd } from "features/settings";
import styled from "styled-components";
import { LinkBlock } from "ui";

export const Cwd: React.FC = () => {
  const { cwd } = useStore($settings);

  const click = React.useCallback(() => selectCwd(), []);
  const value = React.useMemo(() => {
    const cwdArr = (cwd || "").split("/");

    return `${cwdArr[cwdArr.length - 2]}/${cwdArr[cwdArr.length - 1]}`;
  }, [cwd]);

  return <Container onClick={click}>{value}</Container>;
};

const Container = styled(LinkBlock)`
  white-space: nowrap;
`;
