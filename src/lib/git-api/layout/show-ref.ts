import * as showRef from "../core/show-ref";

type GetBranches = () => showRef.Refs;

export const getBranches: GetBranches = () => {
  const refs = showRef.get();

  return Array.from(refs.values()).reduce((memo, ref) => {
    if (ref.type === "heads") {
      memo.set(ref.name, ref);
    }

    return memo;
  }, new Map());
};
