import { execSplit } from "./exec";

export interface Ref {
  type: "HEAD" | "heads" | "remotes" | "tags";
  name: string;
  shortName: string;
  commit: string;
}

export type Refs = Map<string, Ref>;

type CreateRef = (line: string) => Ref | null;

type Get = () => Refs;

const matchHeads = /refs\/heads\//;
const matchRemotes = /refs\/remotes\//;
const matchTags = /refs\/tags\//;

const createRef: CreateRef = line => {
  const [commit, name] = line.split(" ");

  if (name === "HEAD") {
    return { type: "HEAD", name, shortName: name, commit };
  }

  if (name.match(matchHeads)) {
    const shortName = name.replace(matchHeads, "");
    return { type: "heads", name, shortName, commit };
  }

  if (name.match(matchRemotes)) {
    const shortName = name.replace(matchRemotes, "");
    return { type: "remotes", name, shortName, commit };
  }

  if (name.match(matchTags)) {
    const shortName = name.replace(matchTags, "");
    return { type: "tags", name, shortName, commit };
  }

  return null;
};

export const get: Get = () => {
  const lines = execSplit("git show-ref --head").filter(Boolean);

  return lines.reduce((memo, line) => {
    const ref = createRef(line);

    if (ref) {
      memo.set(ref.name, ref);
    }

    return memo;
  }, new Map());
};
