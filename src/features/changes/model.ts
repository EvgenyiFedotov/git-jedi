import { createEvent, createStore, combine, sample } from "effector";
import {
  createCommit as createCommitGit,
  committing,
} from "features/state-git";

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
export const $isShowChanges = createStore<boolean>(true);
export const $commitMessage = combine(
  $type,
  $message,
  (type, message) => `${type}: ${message}`,
);

export const createCommit = createEvent<any>();
export const changeMessage = createEvent<
  React.ChangeEvent<HTMLTextAreaElement>
>();
export const changeType = createEvent<string>();
export const formatMessage = createEvent<any>();
export const toggleIsShowChanges = createEvent<any>();

sample({
  source: $commitMessage,
  clock: createCommit,
  target: createCommitGit,
});

$message.on(changeMessage, (_, { currentTarget: { value } }) => value);
$message.on(formatMessage, (message) => {
  const [firstLine, secondLine, ...otherLines] = message.split("\n");

  if (secondLine === undefined || secondLine === "") {
    return message;
  } else {
    return [firstLine, "", secondLine, ...otherLines].join("\n");
  }
});
$message.on(committing.done, () => "");

$type.on(changeType, (_, type) => type);
$isShowChanges.on(toggleIsShowChanges, (prev) => !prev);
