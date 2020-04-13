import { Unit, split } from "effector";

export const createCheck = <T>(unit: Unit<T>, cb: (value: T) => boolean) =>
  split(unit, {
    done: (value) => cb(value),
    fail: (value) => !cb(value),
  });
