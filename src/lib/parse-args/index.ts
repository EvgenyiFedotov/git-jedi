export function parseArgs(
  args: string[],
): { [nameProp: string]: string | boolean } {
  return args.reduce<{ [nameProp: string]: string | boolean }>((memo, arg) => {
    const [name, value = true] = arg.split("=");

    memo[name] = value;

    return memo;
  }, {});
}
