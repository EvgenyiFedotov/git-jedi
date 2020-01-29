import * as React from "react";
import { notification, Icon, message } from "antd";
import { BaseOptionsOnReject } from "lib/api-git";

const hashCopied = () => message.success("Commit hash copied", 1);

export const onReject: BaseOptionsOnReject = (
  { error, stdout },
  { options },
) => {
  const copy = () => {
    window.navigator.clipboard.writeText(
      JSON.stringify({
        errorMessage: error.message,
        options,
        stdout,
      }),
    );
    hashCopied();
  };

  notification.error({
    message: "Application error",
    description: (
      <div>
        <div>
          <b>{options && options.key}</b>
        </div>
        <div style={{ display: "flex", flexWrap: "nowrap" }}>
          <div>{stdout}</div>
          <Icon type="copy" onClick={copy} />
        </div>
      </div>
    ),
    duration: 0,
    placement: "bottomRight",
  });
};
