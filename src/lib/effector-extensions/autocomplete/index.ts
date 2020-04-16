import * as ef from "effector";

export const createAutocomplete = () => {
  const changeSearch = ef.createEvent<string>();
  const selectValue = ef.createEvent<{ value: string }>();
  const setOptions = ef.createEvent<{ value: string }[]>();
  const clear = ef.createEvent<void>();

  const $options = ef.createStore<{ value: string }[]>([]);
  const $search = ef.restore(changeSearch, "");
  const $value = ef.createStore<string>("");

  ef.forward({
    from: setOptions,
    to: $options,
  });

  const selectedValue = selectValue.map(({ value }) => value);

  ef.forward({
    from: selectedValue,
    to: $value,
  });

  ef.forward({
    from: selectedValue,
    to: $search,
  });

  ef.forward({
    from: changeSearch.map(() => ""),
    to: $value,
  });

  // Clear
  ef.forward({
    from: clear.map(() => ""),
    to: [$search, $value],
  });

  return {
    changeSearch,
    selectValue,
    setOptions,
    clear,
    $options,
    $search,
    $value,
  };
};
