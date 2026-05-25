import React from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  href?: string; // if provided, renders as a Link
  children: React.ReactNode;
}

export default function Button({ variant = "primary", href, children, className = "", ...rest }: ButtonProps) {
  const base = "px-4 py-2 rounded font-medium transition-all duration-200";
  const variants: Record<Variant, string> = {
    primary: "bg-[var(--primary-forest)] text-[var(--white)] hover:bg-[var(--forest-light)]",
    secondary: "bg-[var(--gold)] text-[var(--white)] hover:bg-[var(--gold-light)]",
    ghost: "bg-transparent text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--cream)]",
  };
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
