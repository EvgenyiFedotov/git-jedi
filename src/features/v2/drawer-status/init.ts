import { openStatus, $showStatus, closeStatus } from "./model";

$showStatus.on(openStatus, () => true);
$showStatus.on(closeStatus, () => false);
