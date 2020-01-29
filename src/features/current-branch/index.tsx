import * as React from "react";
import { Select } from "antd";
import { useStore } from "effector-react";

import {
  $onlyBranchRefs,
  $currentBranch,
  checkoutTo,
} from "features/state-git";
import { Row } from "ui";

const { Option } = Select;

export const CurrentBrunch: React.FC = () => {
  const currentBrunch = useStore($currentBranch);
  const onlyBranchRefs = useStore($onlyBranchRefs);

  const options = onlyBranchRefs.map((ref, index) => (
    <Option key={index} value={ref.shortName}>
      {ref.shortName}
    </Option>
  ));

  return (
    <Row>
      <Select
        size="small"
        style={{ width: "140px" }}
        value={currentBrunch}
        onChange={checkoutTo}
      >
        {options}
      </Select>
    </Row>
  );
};
