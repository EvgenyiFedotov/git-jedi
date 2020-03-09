import * as React from "react";
import { useStore } from "effector-react";
import { Autocomplete } from "molecules/autocomplete";

import {
  $options,
  changeSearch,
  selectOption,
  $value,
  changeValue,
} from "../model";

export const CommandsInput: React.FC = () => {
  const options = useStore($options);
  const value = useStore($value);

  return (
    <Autocomplete
      placeholder="command"
      options={options}
      onSearch={changeSearch}
      onSelect={selectOption}
      value={value}
      onChange={changeValue}
      autoFocus={true}
      onEsc={(ref) => ref.blur()}
    />
  );
};
