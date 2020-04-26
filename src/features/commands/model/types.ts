export type Branch = {
  head: string;
  name: string;
  refName: string;
  objectName: string;
  objectType: string;
  push: string;
  remoteName: string;
  remote?: Branch;
};
