import * as React from "react";
import styled from "styled-components";
import { Row } from "ui";
import { useStore } from "effector-react";
import { DiffFile } from "ui/diff-file";
import {
  $diffFiles,
  $diffCachedFiles,
  getDiffFile,
  removeDiffFile,
} from "features/state-git";

import { getDiffFileToElements } from "./diff-file-to-elements";

interface Props {
  path: string;
  cached?: boolean;
}

export const Diff: React.FC<Props> = ({ path, cached }) => {
  const diffFiles = useStore(cached ? $diffCachedFiles : $diffFiles);
  const diffFile = React.useMemo(() => diffFiles.ref.get(path) || null, [
    path,
    diffFiles,
  ]);
  const diffFileToElements = React.useMemo(
    () => getDiffFileToElements(diffFile),
    [diffFile],
  );

  React.useEffect(() => {
    getDiffFile({ path, cached });

    return () => {
      removeDiffFile({ path, cached });
    };
  }, [path, cached]);

  return (
    <Container>
      <DiffFile
        infoLines={diffFileToElements.remove.infoLines}
        codeLines={diffFileToElements.remove.codeLines}
      />
      <DiffFile
        infoLines={diffFileToElements.add.infoLines}
        codeLines={diffFileToElements.add.codeLines}
      />
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
