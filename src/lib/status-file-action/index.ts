import { blue, volcano, grey, green } from "@ant-design/colors";

export type StatusFileAction =
  | "unmodified"
  | "modified"
  | "added"
  | "deleted"
  | "renamed"
  | "copied"
  | "updated but unmerged"
  | "untracked"
  | "ignored"
  | null;

export function toStatusFileAction(action: string): StatusFileAction {
  switch (action) {
    case " ":
      return "unmodified";
    case "M":
      return "modified";
    case "A":
      return "added";
    case "D":
      return "deleted";
    case "R":
      return "renamed";
    case "C":
      return "copied";
    case "U":
      return "updated but unmerged";
    case "?":
      return "untracked";
    case "!":
      return "ignored";
    default:
      return null;
  }
}

export function toColor(action: string): string | undefined {
  switch (action) {
    case "D":
      return volcano.primary;
    case "M":
      return blue.primary;
    case "A":
      return green.primary;
    default:
      return grey[3];
  }
}
