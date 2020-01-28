import * as React from "react";

interface BranchProps {
  if: boolean;
}

export const Branch: React.FC<BranchProps> = ({ if: condition, children }) => {
  const [thenBranch, elseBranch, ...extra] = React.Children.toArray(children);

  if (extra.length > 0) {
    throw new TypeError(
      "More than two elements passed to Branch. Use <Fragment> to pass multiple elements as one branch"
    );
  }

  const result = condition ? thenBranch : elseBranch;

  return <>{result}</> || <></>;
};
