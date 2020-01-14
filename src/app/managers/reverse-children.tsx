import * as React from "react";

export const ReversChildren: React.FC = props => {
  const children = React.Children.toArray(props.children);

  return <>{children.reverse()}</>;
};
