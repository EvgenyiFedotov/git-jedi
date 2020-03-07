import * as React from "react";
import { AutoComplete as AntdAutoComplete } from "antd";
import { useStore } from "effector-react";
import styled from "styled-components";

import {
  $options,
  changeSearch,
  selectOption,
  Option,
  $value,
  changeValue,
} from "../model";

export const CommandsInput: React.FC = () => {
  const options = useStore($options);
  const value = useStore($value);

  const select = React.useCallback(
    (_, option) => selectOption(option as Option),
    [],
  );

  return (
    <AutoComplete
      size="small"
      placeholder="command"
      options={options}
      onSearch={changeSearch}
      onSelect={select}
      value={value}
      onChange={changeValue}
    />
  );
};

const AutoComplete = styled(AntdAutoComplete)`
  width: 100%;
`;
