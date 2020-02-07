import { runCommandGit, RunCommandOptions } from "./process";

export interface ShowRefOptions extends RunCommandOptions {}

export interface Ref {
  type: "HEAD" | "heads" | "remotes" | "tags";
  name: string;
  shortName: string;
  hash: string;
}

export const showRef = (options: RunCommandOptions = {}) => {
  const args = createArgs(options);
  const pipe = runCommandGit(args, options);

  return pipe.next(toLines).next(toRefs);
};

function createArgs(options: RunCommandOptions = {}): string[] {
  return ["show-ref", "--head", "--dereference"];
}

function toLines(stdout: string): string[] {
  return stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function toRefs(lines: string[]): Map<string, Ref> {
  return lines.reduce((memo, line) => {
    const ref = toRef(line);

    if (ref) {
      memo.set(ref.name, ref);
    }

    return memo;
  }, new Map());
}

const matchHeads = /refs\/heads\//;
const matchRemotes = /refs\/remotes\//;
const matchTags = /refs\/tags\//;
// const matchTagsDereference = /\^\{\}$/;

function toRef(line: string): Ref | null {
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
}
