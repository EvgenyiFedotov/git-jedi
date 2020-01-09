import * as React from "react";
import styled from "styled-components";

import * as gitApi from "../lib/git-api";
import { Branches } from "./branches";
import { GlobalStyle } from "./global-style";
import * as ui from "./ui";
import { Branch } from "./managers";

export const App = () => {
  const [branch, setBranch] = React.useState<string>("master");
  const logTree = gitApi.added.logTree.get(branch);
  const parentLabel = gitApi.core.log.getParentLabel(branch);

  return (
    <>
      <GlobalStyle />

      <Container>
        <Header>
          <Branch if={!!parentLabel}>
            <LinkBack
              onClick={() => parentLabel && setBranch(parentLabel.name)}
            >
              Back
            </LinkBack>
            <div></div>
          </Branch>

          <div>{gitApi.core.revParse.getCurrentBranch()}</div>
        </Header>

        <div>
          {Array.from(logTree.values())
            .reverse()
            .map(message => {
              return (
                <Message key={message.commit} style={{ marginBottom: "1rem" }}>
                  <div>{message.note}</div>

                  <Branch if={!!message.branches.length}>
                    <Branches
                      list={message.branches}
                      onClickBranch={nextBranch => setBranch(nextBranch)}
                    />
                  </Branch>
                </Message>
              );
            })}
        </div>
      </Container>
    </>
  );
};

const Container = styled(ui.Column)`
  align-items: center;
`;

const Header = styled(ui.Row)`
  width: 100%;
  background-color: var(--main-color);
  color: var(--bg-color);
  padding: 0.5rem;
  padding-top: 16px;
  justify-content: space-between;
`;

const Message = styled(ui.Column)`
  border: 1px solid var(--main-color);
  border-radius: 3px;
  padding: 0.5rem;
`;

const LinkBack = styled(ui.Link)`
  color: var(--bg-color);
`;
