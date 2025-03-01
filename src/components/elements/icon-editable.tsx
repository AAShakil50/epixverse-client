import { Pen } from "lucide-react";
import { forwardRef } from "react";

type IconEditableProps = {
  onClick: VoidFunction;
};

const IconEditable = forwardRef<SVGSVGElement, IconEditableProps>(
  ({ onClick }) => {
    return (
      <Pen
        role="button"
        size="0.7em"
        onClick={() => onClick()}
        className={`
        mr-1
        opacity-0 hidden
        group-hover:inline group-hover:opacity-100
        group-hover-within:inline group-hover-within:opacity-100
        transition-all
        duration-500`}
        style={{ marginRight: "0.22em" }}
      />
    );
  }
);

IconEditable.displayName = "IconEditable";

export { IconEditable };
