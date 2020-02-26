import { createEvent } from "effector";
import { DiffFileChunk, DiffFile, DiffLine } from "lib/api-git";

export interface DiffFileParams {
  path: string;
  cached?: boolean;
}

export const getDiffFile = createEvent<DiffFileParams>();
export const removeDiffFile = createEvent<DiffFileParams>();
export const stageChunk = createEvent<{
  chunk: DiffFileChunk<DiffLine[]>;
  diffFile: DiffFile<DiffLine[]>;
}>();
