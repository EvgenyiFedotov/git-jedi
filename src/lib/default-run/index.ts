export const defaultRun = <T>(cb: () => T, defValue: T): T => {
  try {
    return cb();
  } catch (error) {
    return defValue;
  }
};
