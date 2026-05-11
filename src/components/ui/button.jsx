import React from "react";

export default function Button({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) {
  const variantClasses = {
    default:
      "bg-[#F0EEFF] text-[#0C0A1E] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.12)] hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(0,0,0,0.08),0_10px_28px_rgba(0,0,0,0.16)] active:translate-y-0",
    outline:
      "border border-white/20 text-foreground bg-transparent hover:bg-white/5 hover:border-white/40 hover:-translate-y-0.5",
    secondary: "bg-secondary text-foreground hover:bg-secondary/80 hover:-translate-y-0.5",
    ghost: "bg-transparent text-foreground hover:bg-foreground/10",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    link: "text-primary underline hover:text-primary/80",
  };

  const sizeClasses = {
    default: "px-4 py-[0.8rem] pl-[1.875rem] text-[0.9375rem] tracking-[0.02em] font-semibold",
    sm: "px-3 py-2 text-xs tracking-wider font-semibold",
    lg: "px-5 py-3.5 pl-7 text-base tracking-[0.02em] font-semibold",
    icon: "h-10 w-10 p-2",
  };

  const finalClass = `inline-flex items-center justify-center gap-3 rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap select-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button type="button" className={finalClass} {...props}>
      {children}
    </button>
  );
}