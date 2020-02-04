import { createStore, createEvent } from "effector";

import { FormattedCommitMessage } from "features/state-git";

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
export const $note = createStore<string>("");

export const changeType = createEvent<string>();
export const changeNote = createEvent<React.ChangeEvent<HTMLTextAreaElement>>();
export const formatNote = createEvent<any>();
export const mount = createEvent<FormattedCommitMessage>();

$type.on(changeType, (_, type) => type);
$type.on(mount, (_, { type }) => type || "feat");

$note.on(changeNote, (_, { currentTarget: { value } }) => value);
$note.on(formatNote, (note) => {
  const [firstLine, secondLine, ...otherLines] = note.split("\n");

  if (secondLine === undefined || secondLine === "") {
    return note;
  } else {
    return [firstLine, "", secondLine, ...otherLines].join("\n");
  }
});
$note.on(mount, (_, { note }) => note);
