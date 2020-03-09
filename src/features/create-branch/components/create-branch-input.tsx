import * as React from "react";
import { Autocomplete } from "molecules/autocomplete";
import { useStore } from "effector-react";

import {
  $value,
  changeValue,
  $options,
  selectOption,
  selectOptionByEnter,
} from "../model";

export const CreateBranchInput: React.FC<{
  onBlur?: () => void;
  onEsc?: () => void;
}> = ({ onBlur, onEsc }) => {
  const value = useStore($value);
  const options = useStore($options);

  const enter = React.useCallback(() => selectOptionByEnter(), []);

  return (
    <Autocomplete
      placeholder="name branch"
      autoFocus={true}
      onBlur={onBlur}
      onEsc={onEsc}
      value={value}
      onChange={changeValue}
      options={options}
      onSelect={selectOption}
      onEnter={enter}
    />
  );
};
