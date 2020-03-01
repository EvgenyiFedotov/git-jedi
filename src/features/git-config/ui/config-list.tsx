import * as React from "react";
import { List } from "antd";
import { Row } from "ui";
import { useStore } from "effector-react";

import { $config, loadConfig } from "../model";

export const ConfigList: React.FC = () => {
  const config = useStore($config);

  React.useEffect(() => loadConfig(), []);

  const items = Object.keys(config).map((name) => {
    const value = config[name];

    return <ConfigItem key={name} name={name} value={value || "unknow"} />;
  });

  return <List size="small">{items}</List>;
};

const ConfigItem: React.FC<{ name: string; value: string }> = ({
  name,
  value,
}) => {
  return (
    <List.Item>
      <Row style={{ justifyContent: "space-between", width: "100%" }}>
        <div>{name}</div>
        <div>{value}</div>
      </Row>
    </List.Item>
  );
};
