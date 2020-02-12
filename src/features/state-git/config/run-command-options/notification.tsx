import * as React from "react";
import { notification, Icon, message } from "antd";
import { RunCommandOnClose } from "lib/api-git";
import { Branch } from "lib/branch";
import { Column, Row } from "ui";

const hashCopied = () => message.success("Commit hash copied", 1);

export const onClose: RunCommandOnClose = (code, scope) => {
  if (!code) return;

  const { args = [] } = scope;
  const { commandOptions = {} } = scope.options;

  const copy = () => copyValue({ code, scope });

  notification.error({
    message: <Message onCopy={copy}>Application error</Message>,
    description: (
      <Description keyCommand={commandOptions.key}>
        <Column>
          <div>Code: {code}</div>
          <div>
            Command: {scope.command} {args.map(sliceWord).join(" ")}
          </div>
        </Column>
      </Description>
    ),
    duration: 0,
    placement: "bottomRight",
  });
};

const Message: React.FC<{ onCopy?: () => void }> = (props) => {
  const { onCopy = () => {} } = props;

  return (
    <Row>
      <div>{props.children}</div>
      <Icon type="copy" onClick={onCopy} />
    </Row>
  );
};

const Description: React.FC<{ keyCommand?: string }> = (props) => {
  const { keyCommand } = props;

  return (
    <div>
      <Branch if={!!keyCommand}>
        <div>
          <b>{keyCommand}</b>
        </div>
      </Branch>
      <div style={{ display: "flex", flexWrap: "nowrap" }}>
        <div>{props.children}</div>
      </div>
    </div>
  );
};

function copyValue<T>(value: T) {
  window.navigator.clipboard.writeText(JSON.stringify(value));
  hashCopied();
}

function sliceWord(value: string): string {
  console.log(value.slice(0, 7));
  return value.length > 7 ? `${value.slice(0, 7)}...` : value;
}
