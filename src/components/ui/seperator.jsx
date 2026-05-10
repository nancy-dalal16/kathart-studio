"use client";

import { forwardRef } from "react";

const Separator = forwardRef(
  ({ className = "", orientation = "horizontal", ...props }, ref) => {
    const isHorizontal = orientation === "horizontal";

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={`
          shrink-0 bg-border
          ${isHorizontal ? "h-px w-full" : "w-px h-full"} 
          ${className}
        `}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";

export { Separator };
