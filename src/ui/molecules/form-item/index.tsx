import * as React from "react";

import { Container, TitleContainer, ContentContainer } from "./ui";

type Props = {
  title?: React.ReactNode;
};

export const FormItem: React.FC<Props> = ({ title, children }) => {
  const titleContainer = React.useMemo(() => {
    return title ? <TitleContainer>{title}</TitleContainer> : null;
  }, [title]);

  const contentContainer = <ContentContainer>{children}</ContentContainer>;

  return (
    <Container>
      {titleContainer}
      {contentContainer}
    </Container>
  );
};
