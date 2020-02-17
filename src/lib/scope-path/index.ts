import path from "path";

export const getScopePath = (value: string, basePath: string = ""): string => {
  const dirname = path.dirname(value);

  if (dirname && dirname !== ".") {
    return dirname.replace(new RegExp(`^${basePath}`), "");
  }

  return "";
};
