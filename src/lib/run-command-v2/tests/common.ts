export const cwd = "./src/lib/run-command-v2/tests/";

export const commandOptions = {
  spawnOptions: { cwd },
};

export function delay(ms: number = 100) {
  return new Promise((res) => setTimeout(res, ms));
}
