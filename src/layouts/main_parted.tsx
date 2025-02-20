import { ReactNode } from "react";

type MainPartedProps = {
  ratio?: number;
  children: [ReactNode, ReactNode];
};

const MainParted = (props: MainPartedProps) => {
  const { ratio, children } = props;
  const [leftNode, rightNode] = children;
  return (
    <main className="flex flex-grow h-full">
      <div className="" style={{ flex: ratio ?? 0 }}>
        {leftNode}
      </div>
      <div className="" style={{ flex: 1 }}>
        {rightNode}
      </div>
    </main>
  );
};

export default MainParted;
