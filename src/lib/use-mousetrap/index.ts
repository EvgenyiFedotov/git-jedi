import * as React from "react";
import mousetrap from "mousetrap";
import { findDOMNode } from "react-dom";

export const useMousetrap = (
  command: string | string[],
  callback: (event: KeyboardEvent, combo: string) => any,
  action?: string,
) => {
  // TODO Error with type HTMLTextAreaElement
  const ref = React.useRef(null);

  React.useEffect(() => {
    const { current } = ref;
    let nodeMousetrap: MousetrapInstance;

    if (current) {
      const messageNode = findDOMNode(current) as Element;
      nodeMousetrap = mousetrap(messageNode);

      nodeMousetrap.bind(command, callback, action);
    }

    return () => {
      if (nodeMousetrap) {
        nodeMousetrap.unbind(command, action);
      }
    };
  }, [ref.current, command, callback]);

  return { ref };
};
