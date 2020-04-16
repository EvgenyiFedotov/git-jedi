import * as React from "react";
import * as ef from "effector";

type Params = {
  mount: ef.Event<void>;
  unmount: ef.Event<void>;
};

export const useMount = ({ mount, unmount }: Params) => {
  React.useEffect(() => {
    mount();

    return () => unmount();
  }, []);
};
