import * as React from "react";
import { Button, Input } from "antd";
import { Branch } from "../../managers/branch";

export const CreateBranch: React.FC = () => {
  const [isShowButton, setIsShowButton] = React.useState<boolean>(true);

  return (
    <div>
      <Branch if={isShowButton}>
        <Button
          size="small"
          title="Create branch"
          style={{ width: "104px" }}
          onClick={() => setIsShowButton(false)}
        >
          Create branch
        </Button>
        <Input
          placeholder="Name branch (⌘Enter)"
          style={{ width: "164px" }}
          size="small"
          onBlur={() => setIsShowButton(true)}
          autoFocus={true}
        />
      </Branch>
    </div>
  );
};
