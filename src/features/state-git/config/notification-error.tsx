import * as React from "react";
import { notification } from "antd";
import { BaseOptionsOnReject } from "lib/api-git";

export const onReject: BaseOptionsOnReject = (
  { error },
  { command, options }
) =>
  notification.error({
    message: "Application error",
    description: (
      <div>
        <div>
          <b>{options && options.key}</b>
        </div>
        <div>{command}</div>
        <div>{options && JSON.stringify(options.execOptions, null, 2)}</div>
        <div>{error.message}</div>
      </div>
    ),
    duration: 0,
    placement: "bottomRight"
  });
