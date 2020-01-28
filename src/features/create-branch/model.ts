import {
  createStore,
  createEvent,
  createEffect,
  combine,
  sample,
} from "effector";
import { checkout, BaseOptions } from "lib/api-git";

import { $baseOptions } from "lib/effector-git/config";

export interface CreatingBranchParams {
  target: string;
  options: BaseOptions;
}

export const $nameBranch = createStore<string>("");
const $creatingBranchParams = combine(
  {
    target: $nameBranch,
    options: $baseOptions,
  },
  (stores) => stores,
);

export const creatingBranch = createEffect<CreatingBranchParams, string>({
  handler: ({ target, options }) =>
    checkout({
      createBranch: true,
      target,
      ...options,
    }),
});

export const changeNameBranch = createEvent<
  React.ChangeEvent<HTMLInputElement>
>();
export const createBranch = createEvent<any>();

createBranch.watch(() => {
  console.log($nameBranch.getState());
});

sample({
  source: $creatingBranchParams,
  clock: createBranch,
  target: creatingBranch,
});

$nameBranch.on(changeNameBranch, (_, event) => event.currentTarget.value);
$nameBranch.on(creatingBranch.done, () => "");
