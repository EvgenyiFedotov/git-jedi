import * as ef from "effector";

export type Status = "pending" | "done" | "fail" | null;

export const createStatusEffect = <P, R>(effect: ef.Effect<P, R>) => {
  const $value = ef.createStore<Status>(null);

  $value.on(effect, () => "pending");
  $value.on(effect.done, () => "done");
  $value.on(effect.fail, () => "fail");

  return $value;
};
