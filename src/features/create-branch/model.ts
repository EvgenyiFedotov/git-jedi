import {
  createStore,
  createEvent,
  createEffect,
  combine,
  sample,
} from "effector";
import { checkout, CheckoutOptions } from "lib/api-git";
import { $baseOptions } from "lib/effector-git/config";

export const $nameBranch = createStore<string>("");
export const $isShowButton = createStore<boolean>(true);
const $createBranchParams = combine(
  $nameBranch,
  $baseOptions,
  (target, options) => ({
    ...options,
    target,
  }),
);

export const changeNameBranch = createEvent<
  React.ChangeEvent<HTMLInputElement>
>();
export const createBranch = createEvent<any>();
export const showButton = createEvent<any>();
export const hideButton = createEvent<any>();

export const creatingBranch = createEffect<CheckoutOptions, string>({
  handler: (options) => checkout({ createBranch: true, ...options }),
});

sample({
  source: $createBranchParams,
  clock: createBranch,
  target: creatingBranch,
});

$nameBranch.on(changeNameBranch, (_, event) => event.currentTarget.value);
$nameBranch.on(creatingBranch.done, () => "");

$isShowButton.on(showButton, () => true);
$isShowButton.on(hideButton, () => false);
$isShowButton.on(creatingBranch.done, () => true);
