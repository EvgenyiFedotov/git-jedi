import { execSplit } from "./exec";

export interface Ref {
  type: "HEAD" | "heads" | "remotes" | "tags";
  name: string;
  shortName: string;
  hash: string;
}

export type Refs = Map<string, Ref>;

export type RefsByCommits = Map<string, Refs>;

type CreateRef = (line: string) => Ref | null;

export interface GetResult {
  refs: Refs;
  refsByCommits: RefsByCommits;
}

type Get = () => GetResult;

const matchHeads = /refs\/heads\//;
const matchRemotes = /refs\/remotes\//;
const matchTags = /refs\/tags\//;
const matchTagsDereference = /\^\{\}$/;

const createRef: CreateRef = line => {
  const [hash, name] = line.split(" ");

  if (name === "HEAD") {
    return { type: "HEAD", name, shortName: name, hash };
  }

  if (name.match(matchHeads)) {
    const shortName = name.replace(matchHeads, "");
    return { type: "heads", name, shortName, hash };
  }

  if (name.match(matchRemotes)) {
    const shortName = name.replace(matchRemotes, "");
    return { type: "remotes", name, shortName, hash };
  }

  if (name.match(matchTags)) {
    const shortName = name.replace(matchTags, "");
    return { type: "tags", name, shortName, hash };
  }

  return null;
};

export const get: Get = () => {
  const lines = execSplit("git show-ref --head --dereference").filter(Boolean);

  return lines.reduce(
    (memo, line) => {
      const ref = createRef(line);

      if (ref) {
        // Filter not dereference tags
        if (ref.type === "tags") {
          if (ref.name.match(matchTagsDereference)) {
            ref.shortName = ref.shortName.replace(matchTagsDereference, "");
          } else {
            return memo;
          }
        }

        memo.refs.set(ref.name, ref);

        if (!memo.refsByCommits.has(ref.hash)) {
          memo.refsByCommits.set(ref.hash, new Map());
        }

        memo.refsByCommits.get(ref.hash).set(ref.name, ref);
      }

      return memo;
    },
    { refs: new Map(), refsByCommits: new Map() }
  );
};
