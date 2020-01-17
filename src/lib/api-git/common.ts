export const stdoutToLines = (stdout: string): string[] => {
  return stdout.split("\n").map(line => line.trim());
};
