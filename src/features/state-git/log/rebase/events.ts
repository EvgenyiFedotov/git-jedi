import { createEvent, merge } from "effector";

import { writingContentCommitMesssage } from "./effects";

export const rebaseUp = createEvent<string>();
export const abortRebase = createEvent<void>();
export const clear = merge([abortRebase, writingContentCommitMesssage.done]);
