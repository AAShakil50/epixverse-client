import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";
import { Link } from "react-router-dom";

type HeaderProps = HTMLAttributes<HTMLElement>

const Header: React.FC<HeaderProps> = ({
  className,
  children
}) => {
  return (
    <header className={cn(`josefin-sans w-full p-4
    flex flex-row justify-between items-center`, className)}>
      {children}
    </header>
  );
}

type HeadingProps = {
  title: string
  href: string
} & HTMLAttributes<HTMLHeadingElement>

const Heading: React.FC<HeadingProps> = ({
  title,
  href,
  className
}) => {
  return <h1
    className={cn('text-lg font-semibold ml-4', className)}>
    <Link to={href}>{title}</Link>
  </h1>
}

type NavContainerProps = HTMLAttributes<HTMLElement>

const NavContainer: React.FC<NavContainerProps> = ({
  className,
  children
}) => {
  return <nav className={cn('mx-4', className)}>
    <ul className={`flex space-x-6 text-sm`}>
      {children}
    </ul>
  </nav>
}

type NavItemLinkProps = {
  href: string
  title: string
  icon: React.ReactNode
} & HTMLAttributes<HTMLLinkElement>

const NavItemLink: React.FC<NavItemLinkProps> = (
  { href, title, icon, className }
) => {
  return <Link
    className={cn('flex gap-1 items-center -mt-1', className)}
    to={href}>
    {icon}{title}
  </Link>
}

export { Header, Heading, NavContainer, NavItemLink };