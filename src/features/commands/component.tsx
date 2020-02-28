import * as React from "react";
import { AutoComplete } from "antd";
import { useStore } from "effector-react";

import {
  $commands,
  $filteredCommands,
  addCommand,
  searchCommand,
  selectCommand,
  focusInput,
} from "./model";
import { createCommand } from "./create-command";

export const Commands: React.FC = () => {
  const filteredCommands = useStore($filteredCommands);
  const options = filteredCommands.reduce<React.ReactElement[]>(
    (memo, value) => {
      memo.push(
        <AutoComplete.Option key={value.id}>{value.name}</AutoComplete.Option>,
      );

      return memo;
    },
    [],
  );

  const select = React.useCallback((id: any) => {
    // TODO antd doesn't return type SelectValue
    if (typeof id === "string") {
      selectCommand(id);
    }
  }, []);

  const focus = React.useCallback(() => focusInput(), []);

  React.useEffect(() => {
    addCommand(createCommand("command#1", () => console.log("RUN COMMAND #1")));
    addCommand(createCommand("command#2", () => {}));
    addCommand(createCommand("command#3", () => {}));
    addCommand(createCommand("command#4", () => {}));
  }, []);

  return (
    <AutoComplete
      size="small"
      onSearch={searchCommand}
      onSelect={select}
      onFocus={focus}
    >
      {options}
    </AutoComplete>
  );
};
