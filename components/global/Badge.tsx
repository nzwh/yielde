import { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface BadgeProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "type"
> {
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  padding?: string;
  type?: "button" | "submit" | "reset";
}

export function Badge({
  href,
  target,
  padding = "px-1 mx-1",

  children,
  className,
  onClick,
  type = "button",

  ...props
}: BadgeProps) {
  const classes = cn(
    "bg-black/10 focus-visible:ring-[#8290EF]",
    "rounded-sm font-semibold transition-colors duration-200 focus-visible:ring-1 focus-visible:outline-none",
    (href || onClick) && "hover:bg-black/15 cursor-pointer",
    href && "hover:underline",
    padding,
    className,
  );

  function handleClick(e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) {
    e.stopPropagation();
    onClick?.(e as MouseEvent<HTMLAnchorElement>);
  }

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={classes}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type={type}
        className={classes}
        onClick={handleClick}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
