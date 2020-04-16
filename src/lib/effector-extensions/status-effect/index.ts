import * as ef from "effector";

export type Status = "pending" | "done" | "fail" | null;

export const createStatusEffect = <P, R>(effect: ef.Effect<P, R>) => {
  const $value = ef.createStore<Status>(null);
  const clear = ef.createEvent<void>();

  $value.on(effect, () => "pending");
  $value.on(effect.done, () => "done");
  $value.on(effect.fail, () => "fail");
  $value.on(clear, () => null);

  return { $value, clear };
};
