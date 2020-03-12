import * as React from "react";
import { useStore } from "effector-react";

import { Autocomplete } from "molecules/autocomplete";

import { $options, $value, changeValue, selectOption } from "./model";

export const RemoveBranchInput: React.FC<{
  onBlur?: () => void;
  onEsc?: () => void;
}> = ({ onBlur, onEsc = () => {} }) => {
  const options = useStore($options);
  const value = useStore($value);

  return (
    <Autocomplete
      placeholder="remove branch"
      options={options}
      onSelect={selectOption}
      value={value}
      onChange={changeValue}
      autoFocus={true}
      onBlur={onBlur}
      onEsc={onEsc}
    />
  );
};
