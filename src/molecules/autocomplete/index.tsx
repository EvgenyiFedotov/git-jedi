import * as React from "react";
import * as antd from "antd";
import styled from "styled-components";
import mousetrap from "mousetrap";
import { findDOMNode } from "react-dom";

type Ref = antd.Select<any>;

interface Props<Option> {
  options?: Option[];
  value?: string;
  placeholder?: string;
  onSearch?: (search: string) => void;
  onChange?: (value: string) => void;
  onSelect?: (option: Option) => void;
  onBlur?: () => void;
  onEsc?: (ref: Ref) => void;
  autoFocus?: boolean;
}

export function Autocomplete<Option>(props: Props<Option>) {
  const { onSelect = () => {}, onEsc = () => {} } = props;

  const select = React.useCallback((_, option) => onSelect(option as Option), [
    onSelect,
  ]);

  const ref = React.useRef<Ref>(null);

  React.useEffect(() => {
    const current = ref.current;

    if (current) {
      const instance = mousetrap(findDOMNode(current) as Element);

      instance.bind("esc", () => onEsc(current));

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
