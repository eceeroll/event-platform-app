import { ReactNode } from "react";

interface ComponentProps {
  children: ReactNode;
}

const MyComponent: React.FC<ComponentProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default MyComponent;
