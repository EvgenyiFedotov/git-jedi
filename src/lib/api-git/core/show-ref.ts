import { exec, execSync, BaseOptions } from "./exec";
import { stdoutToLines } from "./common";

export interface Ref {
  type: "HEAD" | "heads" | "remotes" | "tags";
  name: string;
  shortName: string;
  hash: string;
}

export type Refs = Map<string, Ref>;

export type RefsByCommits = Map<string, Refs>;

export interface ShowRef {
  refs: Refs;
  refsByCommits: RefsByCommits;
}

const createCommand = (): string => {
  return "git show-ref --head --dereference";
};

const toLines = (result: string): string[] => {
  return stdoutToLines(result).filter(Boolean);
};

const matchHeads = /refs\/heads\//;
const matchRemotes = /refs\/remotes\//;
const matchTags = /refs\/tags\//;
const matchTagsDereference = /\^\{\}$/;

const toRef = (line: string): Ref | null => {
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

const setRefToMemo = (memo: ShowRef, ref: Ref): void => {
  const { refs, refsByCommits } = memo;

  // Filter not dereference tags
  if (ref.type === "tags") {
    if (ref.name.match(matchTagsDereference)) {
      ref.shortName = ref.shortName.replace(matchTagsDereference, "");
    } else {
      return;
    }
  }

  refs.set(ref.name, ref);

  if (!refsByCommits.has(ref.hash)) {
    refsByCommits.set(ref.hash, new Map());
  }

  refsByCommits.get(ref.hash)?.set(ref.name, ref);
};

const toShowRef = (lines: string[]): ShowRef => {
  return lines.reduce(
    (memo, line) => {
      const ref = toRef(line);

      if (ref) {
        setRefToMemo(memo, ref);
      }

      return memo;
    },
    { refs: new Map(), refsByCommits: new Map() }
  );
};

export const showRef = async (options: BaseOptions = {}): Promise<ShowRef> => {
  const command = createCommand();
  const execResult = exec(command, options.execOptions);
  return execResult.then(toLines).then(toShowRef);
};

export const showRefSync = (options: BaseOptions = {}): ShowRef => {
  const command = createCommand();
  const execResult = execSync(command, options.execOptions);
  const lines = toLines(execResult);
  return toShowRef(lines);
};
