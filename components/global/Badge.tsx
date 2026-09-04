import { AnchorHTMLAttributes, MouseEvent, MouseEventHandler } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface BadgeProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  padding?: string;
}

export function Badge({
  href,
  target,
  padding = "px-1 mx-1",

  children,
  className,
  onClick,

  ...props
}: BadgeProps) {
  const classes = cn(
    "rounded-sm bg-black/10 font-semibold transition-colors duration-200",
    href && "hover:bg-black/15 hover:underline cursor-pointer",
    padding,
    className,
  );

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    e.stopPropagation();
    onClick?.(e);
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

  return (
    <span
      className={classes}
      onClick={handleClick as unknown as MouseEventHandler<HTMLSpanElement>}
      {...props}
    >
      {children}
    </span>
  );
}
