import { cn } from "@/lib/utils";
import React, { HTMLAttributes, useEffect, useRef } from "react";

type EditableProps = {
  text: string;
  onContentChange: (value: string) => void;
} & HTMLAttributes<HTMLSpanElement>;

const Editable: React.FC<EditableProps> = ({
  text,
  onContentChange,
  className,
}) => {
  const editableRef = useRef<HTMLSpanElement>(null);
  const saveRef = useRef(false);

  useEffect(() => {
    if (editableRef.current && !saveRef.current) {
      editableRef.current.textContent = text;
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveRef.current = true;
      if (editableRef.current) {
        onContentChange(editableRef.current.textContent || "");
      }
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      // Revert changes on Escape
      saveRef.current = false;
      if (editableRef.current) {
        editableRef.current.textContent = text;
      }
      e.currentTarget.blur();
    }
  };

  const handleBlur = () => {
    if (!saveRef.current && editableRef.current) {
      // If not saving, revert to original text.
      editableRef.current.textContent = text;
    }
    saveRef.current = false;
  };

  return (
    <span
      className={cn(className)}
      ref={editableRef}
      contentEditable
      suppressContentEditableWarning
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      style={{
        display: "inline-block",
        minWidth: "1em",
        outline: "none",
      }}
    />
  );
};

export { Editable };
