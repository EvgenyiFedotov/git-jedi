import {
  createStore,
  createEvent,
  createEffect,
  sample,
  combine,
} from "effector";
import * as React from "react";

import { commit, BaseOptions } from "lib/api-git";
import { $baseOptions } from "lib/effector-git";

export const $types = createStore<string[]>([
  "feat",
  "fix",
  "build",
  "chore",
  "ci",
  "docs",
  "style",
  "refactor",
  "test",
]);
export const $type = createStore<string>("feat");
export const $message = createStore<string>("");
export const $committingParams = combine(
  {
    type: $type,
    message: $message,
    baseOptions: $baseOptions,
  },
  ({ type, message, baseOptions }) => {
    return {
      message: `${type}: ${message}`,
      baseOptions,
    };
  },
);
export const $isShowChanges = createStore<boolean>(true);

export const committing = createEffect<
  { message: string; baseOptions: BaseOptions },
  string
>({
  handler: async ({ message, baseOptions }) => {
    return commit({
      message,
      ...baseOptions,
    });
  },
});

export const changeCommiteMessage = createEvent<
  React.ChangeEvent<HTMLTextAreaElement>
>();
export const formatMessage = createEvent<any>();
export const createCommit = createEvent<any>();
export const changeType = createEvent<string>();
export const toggleIsShowChanges = createEvent<any>();

sample({
  source: $committingParams,
  clock: createCommit,
  target: committing,
});

$message.on(changeCommiteMessage, (_, { currentTarget: { value } }) => value);
$message.on(formatMessage, (message) => {
  const [firstLine, secondLine, ...otherLines] = message.split("\n");

  if (secondLine === undefined || secondLine === "") {
    return message;
  } else {
    return [firstLine, "", secondLine, ...otherLines].join("\n");
  }
});

$type.on(changeType, (_, type) => type);

$isShowChanges.on(toggleIsShowChanges, (prev) => !prev);
