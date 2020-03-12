import { openBranchList, $showBranchList, closeBranchList } from "./model";

$showBranchList.on(openBranchList, () => true);
$showBranchList.on(closeBranchList, () => false);
