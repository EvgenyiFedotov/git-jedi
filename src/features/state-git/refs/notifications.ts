import { notification } from "antd";
import { BaseOptionsOnReject } from "lib/api-git";

export const createInitCommit: BaseOptionsOnReject = () =>
  notification.error({
    message: "Create initial commit into 'master' branch",
    placement: "bottomRight",
    duration: 0,
  });
