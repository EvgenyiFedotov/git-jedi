import { createStore, createEvent, sample } from "effector";
import {
  creatingBranch,
  createBranch as createBranchGit,
} from "features/state-git";

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
$nameBranch.on(creatingBranch.done, () => "");

$isShowButton.on(showButton, () => true);
$isShowButton.on(hideButton, () => false);
$isShowButton.on(creatingBranch.done, () => true);
