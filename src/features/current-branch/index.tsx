import * as React from "react";
import { Select } from "antd";
import { useStore } from "effector-react";

import {
  $refsOnlyBranches,
  $currentBranch,
  checkoutTo,
} from "features/state-git";
import { Row } from "ui";
import { Branch } from "lib/branch";

const { Option } = Select;

export const CurrentBrunch: React.FC = () => {
  const currentBrunch = useStore($currentBranch);
  const refsOnlyBranches = useStore($refsOnlyBranches);

  const options = Array.from(refsOnlyBranches.values()).map((ref, index) => (
    <Option key={index} value={ref.shortName}>
      {ref.shortName}
    </Option>
  ));

  return (
    <Branch if={typeof currentBrunch === "string"}>
      <Row>
        <Select
          size="small"
          style={{ width: "140px" }}
          value={currentBrunch || ""}
          onChange={checkoutTo}
        >
          {options}
        </Select>
      </Row>
    </Branch>
  );
};
