import * as React from "react";
import * as antd from "antd";
import styled from "styled-components";
import mousetrap from "mousetrap";
import { findDOMNode } from "react-dom";

interface Props<Option> {
  options?: Option[];
  value?: string;
  placeholder?: string;
  onSearch?: (search: string) => void;
  onChange?: (value: string) => void;
  onSelect?: (option: Option) => void;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  onEsc?: () => void;
  autoFocus?: boolean;
}

export function Autocomplete<Option>(props: Props<Option>) {
  const { onSelect = () => {}, onEsc = () => {} } = props;

  const select = React.useCallback((_, option) => onSelect(option as Option), [
    onSelect,
  ]);

  const ref = React.useRef<antd.Select<any>>(null);

  React.useEffect(() => {
    if (ref.current) {
      const instance = mousetrap(findDOMNode(ref.current) as Element);

      instance.bind("esc", () => onEsc());

      return () => {
        instance.unbind("esc");
      };
    }
  }, [ref, onEsc]);

  // TODO bug in types antd
  return (
    <Container
      size="small"
      ref={ref}
      placeholder={props.placeholder}
      options={props.options as any}
      onSearch={props.onSearch}
      onChange={props.onChange}
      onSelect={select}
      value={props.value}
      onBlur={props.onBlur}
      autoFocus={props.autoFocus}
    />
  );
}

const Container = styled(antd.AutoComplete)`
  width: 100%;
`;
