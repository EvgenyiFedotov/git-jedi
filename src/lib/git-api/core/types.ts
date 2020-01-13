export interface Branch {
  name: string;
  head: boolean;
  remote: boolean;
  current: boolean;
}

export interface Tag {
  name: string;
}

export type Ref = Branch | Tag;

export type Refs = Map<string, Ref>;

export interface Commit {
  hash: string;
  parentHash: string[];
  dateTime: string;
  author: string;
  note: string;
}

export type Log = Map<string, Commit>;
