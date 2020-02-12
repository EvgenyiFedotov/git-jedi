import { createStore, createEvent, sample } from "effector";
import { createBranch as createBranchGit, checkout } from "features/state-git";

export const $nameBranch = createStore<string>("");
export const $isShowButton = createStore<boolean>(true);

export const changeNameBranch = createEvent<
  React.ChangeEvent<HTMLInputElement>
>();
export const createBranch = createEvent<any>();
export const showButton = createEvent<any>();
export const hideButton = createEvent<any>();

sample({
  source: $nameBranch,
  clock: createBranch,
  target: createBranchGit,
});

$nameBranch.on(changeNameBranch, (_, event) => event.currentTarget.value);
$nameBranch.on(checkout.done, () => "");

$isShowButton.on(showButton, () => true);
$isShowButton.on(hideButton, () => false);
$isShowButton.on(checkout.done, () => true);
