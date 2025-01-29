import { APP_NAME } from "@/lib/site.configs";
import { Projector, User } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className={`josefin-sans w-full flex flex-row justify-between p-4 items-center`}>
      <h1 className={`text-lg font-semibold`}><Link to={"/"}>{APP_NAME}</Link></h1>
      <nav className={`mx-4`}>
        <ul className={`flex space-x-6 text-sm`}>
          <LinkedItem href="/projects" title="Projects" icon={<Projector size={16} className="-mt-1" />} />
          <LinkedItem href="/profile" title="Profile" icon={<User size={16} className="-mt-1" />} />
        </ul>
      </nav>
    </header>
  );
}

const LinkedItem = ({ href, title, icon }:
  { href: string, title: string, icon: React.ReactNode }) => {
    return <Link className={`flex gap-1 items-center -mt-1`} to={href}>
      {icon}{title}
    </Link>
}

export default Header;