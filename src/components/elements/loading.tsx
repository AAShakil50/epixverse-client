import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import React, { HTMLAttributes } from "react";

type LoadingComponentProps = {
  loadingText?: string;
  loadingSize?: number | string;
  loadingIcon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
} & HTMLAttributes<HTMLElement>;

const LoadingComponent: React.FC<LoadingComponentProps> = ({
  loadingText = "Loading ...",
  loadingSize = 24,
  loadingIcon = <Loader size={loadingSize} />,
  className,
}: LoadingComponentProps) => {
  return (
    <center className={cn("flex m-auto", className)}>
      {loadingIcon}
      <div className={`text-2xl`}>{loadingText}</div>
    </center>
  );
};

export default LoadingComponent;
