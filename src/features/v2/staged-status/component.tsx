import * as React from "react";
import { useStore } from "effector-react";
import { $status } from "features/v2/status";

export const StagedStatus: React.FC = () => {
  const status = useStore($status);

  console.log(status);

  return <div>StagedStatus</div>;
};
