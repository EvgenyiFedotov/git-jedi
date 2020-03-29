import * as ef from "effector";
import { createAutocomplete } from "lib/added-effector/autocomplete";
import { createVisible } from "lib/added-effector/visible";

export const MAX_FIRST_LINE_LENGTH = 80;

// Types
export const types = createAutocomplete();

// Breaking changes
export const changeBreakingChangesFlag = ef.createEvent<boolean>();

export const $breakingChangesFlag = ef.restore(
  changeBreakingChangesFlag,
  false,
);

// Scopes
export const scopes = createAutocomplete();

// Visible body
export const visibleBody = createVisible();

// Title
export const changeTitle = ef.createEvent<string>();

export const $title = ef.restore(changeTitle, "");

// Body
export const changeBody = ef.createEvent<string>();

export const $body = ef.restore(changeBody, "");

// Breaking changes
export const changeBreakingChanges = ef.createEvent<string>();

export const $breakingChanges = ef.restore(changeBreakingChanges, "");

export const $commit = ef.combine({
  type: types.$value,
  breakingChangesFlag: $breakingChangesFlag,
  scope: ef.combine([scopes.$value, scopes.$search]).map(([value, search]) => {
    return value ? `(${value})` : search ? `(${search})` : "";
  }),
  title: $title,
  body: $body,
  breakingChanges: $breakingChanges,
});

// Count title letters
export const $countTitleLetters = $commit.map((commit) => {
  const separatorLength = 2;
  const currentLength =
    commit.type.length +
    commit.scope.length +
    separatorLength +
    (commit.breakingChangesFlag ? 1 : 0);

  return {
    current: commit.title.length,
    total: MAX_FIRST_LINE_LENGTH - currentLength,
  };
});

// Create commit
export const createCommit = ef.createEvent<void>();

// Clear
export const clear = ef.createEvent<void>();
