import { createEvent } from "effector";
import { createRunCommandEvent } from "features/settings";

import { createBranch as createBranchEffect } from "./effect";

export type Option = { value: string };

export const changeValue = createEvent<string>();
export const selectOption = createEvent<Option>();
export const createBranch = createRunCommandEvent(createBranchEffect);
export const createdBranch = createEvent<void>();
export const selectOptionByEnter = createEvent<void>();
export const changeCurrentBranch = createEvent<string>();
