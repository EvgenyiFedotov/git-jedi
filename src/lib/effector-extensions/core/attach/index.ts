import * as ef from "effector";

export function attachEffect<Params, Result>(
  effect: ef.Effect<Params, Result>,
) {
  const event = ef.createEvent<Params>();

  ef.forward({ from: event, to: effect });

  return event;
}

export function attachStore<Result, Params = void>(
  effect: ef.Effect<Params, Result>,
  defaultValue: Result,
) {
  return ef.restore(
    effect.done.map(({ result }) => result),
    defaultValue,
  );
}
