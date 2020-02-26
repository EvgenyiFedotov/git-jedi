import { createEvent } from "effector";

export const changeContentFile = createEvent<{
  fileName: string;
  content: string;
}>();
