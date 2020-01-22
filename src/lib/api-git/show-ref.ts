import { exec, execSync, BaseOptions } from "./exec";
import { stdoutToLines } from "./common";

export interface Ref {
  type: "HEAD" | "heads" | "remotes" | "tags";
  name: string;
  shortName: string;
  hash: string;
}

export type Refs = Map<string, Ref>;

const createCommand = (): string => {
  return "git show-ref --head --dereference";
};

const toLines = (result: string): string[] => {
  return stdoutToLines(result).filter(Boolean);
};

const matchHeads = /refs\/heads\//;
const matchRemotes = /refs\/remotes\//;
const matchTags = /refs\/tags\//;
// const matchTagsDereference = /\^\{\}$/;

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

const toShowRef = (lines: string[]): Refs => {
  return lines.reduce((memo, line) => {
    const ref = toRef(line);

    if (ref) {
      memo.set(ref.name, ref);
    }

    return memo;
  }, new Map());
};

export const showRef = async (options: BaseOptions = {}): Promise<Refs> => {
  const command = createCommand();
  const execResult = exec(command, options);
  return execResult.then(toLines).then(toShowRef);
};

export const showRefSync = (options: BaseOptions = {}): Refs => {
  const command = createCommand();
  const execResult = execSync(command, options);
  const lines = toLines(execResult);
  return toShowRef(lines);
};
