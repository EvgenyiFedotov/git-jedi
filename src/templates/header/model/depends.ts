import { createCommand, addCommand } from "features/commands";
import mousetrap from "mousetrap";

import { changeVisibleRemoteUrl } from "./events";

addCommand(createCommand("remote:add", () => changeVisibleRemoteUrl.show()));

mousetrap.bind("esc", () => changeVisibleRemoteUrl.hide());
