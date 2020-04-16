import * as ef from "effector";

type Options<Value, ListItem, SearchItem> = {
  defaultValue: Value;
  list: ef.Store<ListItem[]>;
  filter: (item: ListItem, value: Value) => boolean;
  map: (item: ListItem) => SearchItem;
};

export const createSearch = <Value, ListItem, SearchItem>(
  options: Options<Value, ListItem, SearchItem>,
) => {
  const changeValue = ef.createEvent<Value>();

  const $value = ef.restore(changeValue, options.defaultValue);

  const $list = ef.combine([options.list, $value], ([list, value]) => {
    let searchList: ListItem[] = [];

    if (value) {
      searchList = list.filter((item) => options.filter(item, value));
    } else {
      searchList = list;
    }

    return searchList.map(options.map);
  });

  return { changeValue, $value, $list };
};
