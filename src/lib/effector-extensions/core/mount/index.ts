import * as ef from "effector";

export const createMount = () => ({
  mount: ef.createEvent<void>(),
  unmount: ef.createEvent<void>(),
});
