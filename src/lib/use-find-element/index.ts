import * as React from "react";
import { findDOMNode } from "react-dom";

export const useFindElement = (
  effect: ((element: Element) => () => void) | ((element: Element) => void),
) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const { current } = ref;

    if (current && effect) {
      const element = findDOMNode(current) as Element;

      if (element) {
        const result = effect(element);

        return result;
      }
    }
  }, [ref.current, effect]);

  return { ref };
};
