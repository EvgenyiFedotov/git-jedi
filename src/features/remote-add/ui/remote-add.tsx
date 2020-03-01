import * as React from "react";
import { Input } from "antd";
import { useStore } from "effector-react";
import { useFindElement } from "lib/use-find-element";
import mousetrap from "mousetrap";

import { addRemoteUrl, changeRemoteUrl, $remoteUrl } from "../model";

export const RemoteAdd: React.FC<{ onClose?: () => void }> = (props) => {
  const { onClose = () => {} } = props;
  const remoteUrl = useStore($remoteUrl);

  const { ref } = useFindElement((element) => {
    const instanceMousetrap = mousetrap(element);

    instanceMousetrap.bind("command+enter", () => {
      addRemoteUrl();
      onClose();
    });
    instanceMousetrap.bind("esc", () => onClose());

    return () => {
      instanceMousetrap.unbind("command+enter");
      instanceMousetrap.unbind("esc");
    };
  });

  const change = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      changeRemoteUrl(event.currentTarget.value);
    },
    [],
  );

  return (
    <Input
      placeholder="remote url"
      size="small"
      autoFocus={true}
      ref={ref}
      value={remoteUrl}
      onChange={change}
    />
  );
};
