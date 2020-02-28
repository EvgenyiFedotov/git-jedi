import { createStore } from "effector";

import { showTooltips, hideTooltips } from "./events";

export const $isShowTooltips = createStore<boolean>(false);

$isShowTooltips.on(showTooltips, () => true);
$isShowTooltips.on(hideTooltips, () => false);
