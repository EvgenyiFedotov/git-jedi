import * as React from "react";
import { useStore } from "effector-react";
import { List } from "antd";

import { $commands, Command as TCommand } from "../model";

export const CommandsList: React.FC = () => {
  const { ref: commands } = useStore($commands);

  const list = Array.from(commands.values()).map((command) => (
    <Command key={command.id} command={command} />
  ));

  return <List size="small">{list}</List>;
};

export const Command: React.FC<{ command: TCommand }> = ({ command }) => {
  const { title, event } = command;
  const click = React.useCallback(() => event(), [event]);

  return <List.Item onClick={click}>{title}</List.Item>;
};
