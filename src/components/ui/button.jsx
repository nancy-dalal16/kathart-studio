import React from "react";

export default function Button({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) {
  const isPrimaryBtn = className.includes("primary-btn");

  const variantClasses = {
    default: "bg-primary text-white hover:shadow-[0_0_25px_rgba(184,139,255,0.5)]",
    outline: "border border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary",
    secondary: "bg-secondary text-foreground hover:bg-secondary/80",
    ghost: "bg-transparent text-foreground hover:bg-foreground/10",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    link: "text-primary underline hover:text-primary/80",
  };

  const sizeClasses = {
    default: "h-10 px-5 py-2.5 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10 p-2",
  };

  const finalClass = `inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 cursor-pointer relative overflow-visible group ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button type="button" className={finalClass} {...props}>
      <span className="relative z-10">{children}</span>
      {!isPrimaryBtn && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out pointer-events-none" />
      )}
    </button>
  );
}