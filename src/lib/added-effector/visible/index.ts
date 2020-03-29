import * as ef from "effector";

export const createVisible = (defValue: boolean = false) => {
  const show = ef.createEvent<void>();
  const hide = ef.createEvent<void>();

  const $value = ef.createStore<boolean>(defValue);

  $value.on(show, () => true);
  $value.on(hide, () => false);

  return {
    show,
    hide,
    $value,
  };
};
