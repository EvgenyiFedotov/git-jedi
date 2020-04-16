import * as ef from "effector";

export type FormField<StoreValue, EventValue> = {
  $value: ef.Store<StoreValue>;
  change: ef.Event<EventValue>;
};

export function createFormField<StoreValue>(
  defaultValue: StoreValue,
): FormField<StoreValue, StoreValue>;

export function createFormField<StoreValue, EventValue>(
  defaultValue: StoreValue,
  handler: (value: EventValue) => StoreValue,
): FormField<StoreValue, EventValue>;

export function createFormField<StoreValue, EventValue>(
  defaultValue: StoreValue,
  handler?: (value: EventValue) => StoreValue,
) {
  const updateValue = ef.createEvent<StoreValue>();

  const $value = ef.restore(updateValue, defaultValue);

  if (handler) {
    return withHandler(updateValue, $value, handler);
  }

  return withoutHandler(updateValue, $value);
}

function withoutHandler<StoreValue>(
  updateValue: ef.Event<StoreValue>,
  $value: ef.Store<StoreValue>,
): FormField<StoreValue, StoreValue> {
  const change = ef.createEvent<StoreValue>();

  ef.forward({
    from: change,
    to: updateValue,
  });

  return { $value, change };
}

function withHandler<StoreValue, EventValue>(
  updateValue: ef.Event<StoreValue>,
  $value: ef.Store<StoreValue>,
  handler: (value: EventValue) => StoreValue,
): FormField<StoreValue, EventValue> {
  const change = ef.createEvent<EventValue>();

  ef.forward({
    from: change.map(handler),
    to: updateValue,
  });

  return { $value, change };
}
