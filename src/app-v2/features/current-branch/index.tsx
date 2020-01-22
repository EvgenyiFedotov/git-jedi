import * as React from "react";
import { Select } from "antd";
import { useStore } from "effector-react";

import {
  $refsOnlyBranches,
  $currentBranch,
  changeBranch
} from "../../../lib/effector-git";

const { Option } = Select;

export const CurrentBrunch: React.FC = () => {
  const currentBrunch = useStore($currentBranch);
  const refsOnlyBranches = useStore($refsOnlyBranches);

  const options = refsOnlyBranches.map((ref, index) => (
    <Option key={index} value={ref.shortName}>
      {ref.shortName}
    </Option>
  ));

  return (
    <Select
      size="small"
      style={{ width: "140px" }}
      defaultValue={currentBrunch}
      onChange={changeBranch}
    >
      {options}
    </Select>
  );
};
