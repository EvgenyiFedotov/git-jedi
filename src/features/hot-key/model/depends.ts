import mousetrap from "mousetrap";

import { showTooltips, hideTooltips } from "./events";

mousetrap.bind("command", () => showTooltips());
mousetrap.bind("command", () => hideTooltips(), "keyup");
