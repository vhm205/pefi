import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import clsx from "clsx";

type Props = {
  href: string;
  children: React.ReactNode;
  extraClasses?: string;
};

export function Link({ href, children, extraClasses }: Props) {
  const { pathname } = useLocation();
  const isActive = href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <RouterLink
      to={href}
      className={clsx(isActive ? "is-active" : undefined, extraClasses)}
    >
      {children}
    </RouterLink>
  );
}
