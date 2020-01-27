import { createStore, createEffect, forward, createEvent } from "effector";

import { revParse, revParseSync, checkout } from "../api-git";
import { $baseOptions } from "./config";
import { creatingBranch } from "../../app-v2/features/create-branch/model";

let defaultCurrentBranch;
try {
  defaultCurrentBranch = revParseSync({
    ...$baseOptions.getState(),
    onReject: () => {}
  });
} catch (error) {
  defaultCurrentBranch = "master";
}

export const $currentBranch = createStore<string>(defaultCurrentBranch);

export const changeBranch = createEvent<string>();

const updateCurrentBranch = createEffect<void, string>({
  handler: () => revParse($baseOptions.getState())
});

const checkoutToBranch = createEffect<string, string>({
  handler: branch => checkout({ branch, ...$baseOptions.getState() })
});

forward({ from: $baseOptions, to: updateCurrentBranch });

forward({ from: changeBranch, to: checkoutToBranch });

forward({ from: checkoutToBranch.done, to: updateCurrentBranch });

forward({ from: creatingBranch.done, to: updateCurrentBranch });

$currentBranch.on(updateCurrentBranch.done, (_, { result }) => result);
