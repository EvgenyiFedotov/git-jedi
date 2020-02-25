import * as React from "react";
import styled from "styled-components";
import { Row } from "ui";
import { DiffByMode } from "ui/diff-by-mode";
import { useStore } from "effector-react";

import { $diffFiles, getDiffFile, removeDiffFile } from "./model";

interface Props {
  path: string;
  cached?: boolean;
}

export const Diff: React.FC<Props> = ({ path, cached }) => {
  const diffFiles = useStore($diffFiles);
  const diffFile = React.useMemo(() => diffFiles.ref.get(path) || null, [
    path,
    diffFiles,
  ]);

  React.useEffect(() => {
    getDiffFile({ path, cached });

    return () => {
      removeDiffFile(path);
    };
  }, [path, cached]);

  return (
    <Container>
      <DiffByMode diffFile={diffFile} mode="remove" />
      <DiffByMode diffFile={diffFile} mode="add" />
    </Container>
  );
};

const Container = styled(Row)`
  flex-wrap: nowrap;
  align-items: flex-start;

  & > *:not(:last-child),
  & > * {
    margin: 0;
    padding: 0 8px;
    width: 50%;
  }
`;
