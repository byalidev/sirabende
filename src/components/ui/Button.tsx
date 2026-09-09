import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "quiet";
  className?: string;
};

export function Button({ children, href, variant = "primary", className = "" }: ButtonProps) {
  return (
    <a className={`button-${variant} ${className}`} href={href}>
      {children}
    </a>
  );
}