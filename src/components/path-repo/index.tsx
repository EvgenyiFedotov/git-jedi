import * as React from "react";
import styled from "styled-components";
import { useStore } from "effector-react";
import { LinkBlock } from "ui";

import { settings } from "model";

const $pathRepo = settings.$cwd.map((cwd) => {
  const cwdArr = (cwd || "").split("/");

  return `${cwdArr[cwdArr.length - 2]}/${cwdArr[cwdArr.length - 1]}`;
});

export const PathRepo: React.FC = () => {
  const pathRepo = useStore($pathRepo);

  const click = React.useCallback(() => settings.selectCwd(), []);

  return <Container onClick={click}>{pathRepo}</Container>;
};

const Container = styled(LinkBlock)`
  white-space: nowrap;
`;
