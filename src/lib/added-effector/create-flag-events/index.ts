import { createEvent } from "effector";

export const createFlagEvents = () => ({
  show: createEvent<void>(),
  hide: createEvent<void>(),
});
