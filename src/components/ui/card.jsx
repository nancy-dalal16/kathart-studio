import React from "react";

// Main Card Wrapper
export function Card({ children, className = "", style, ...props }) {
  return (
    <div 
      className={`rounded-xl shadow-sm overflow-hidden ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

// Header
export function CardHeader({ children, className = "" }) {
  return (
    <div className={`p-6 flex flex-col gap-1.5 ${className}`}>{children}</div>
  );
}

// Title
export function CardTitle({ children, className = "" }) {
  return (
    <h3
      className={`text-xl font-semibold tracking-tight text-foreground ${className}`}
    >
      {children}
    </h3>
  );
}

// Description
export function CardDescription({ children, className = "" }) {
  return (
    <p className={`text-sm text-textColor leading-6 ${className}`}>
      {children}
    </p>
  );
}

// Content
export function CardContent({ children, className = "" }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

// Footer
export function CardFooter({ children, className = "" }) {
  return (
    <div className={`p-6 pt-0 flex items-center ${className}`}>{children}</div>
  );
}
