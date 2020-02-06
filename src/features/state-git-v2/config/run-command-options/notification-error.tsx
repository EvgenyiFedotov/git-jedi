import * as React from "react";
import { notification, Icon, message } from "antd";
import { RunCommandOnError } from "lib/api-git-v2";

const hashCopied = () => message.success("Commit hash copied", 1);

export const onError: RunCommandOnError = (error, { options }) => {
  const { commandOptions = {} } = options;
  const { key } = commandOptions;

  const copy = () => {
    window.navigator.clipboard.writeText(
      JSON.stringify({
        errorMessage: error.message,
        options,
      }),
    );
    hashCopied();
  };

  notification.error({
    message: "Application error",
    description: (
      <div>
        <div>
          <b>{key}</b>
        </div>
        <div style={{ display: "flex", flexWrap: "nowrap" }}>
          <div>{error.message}</div>
          <Icon type="copy" onClick={copy} />
        </div>
      </div>
    ),
    duration: 0,
    placement: "bottomRight",
  });
};
