import { Home, Projector, User } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className={`josefin-sans w-full flex flex-row justify-between p-8 items-center`}>
      <h1 className={`text-4xl font-bold`}><Link to={"/"}>EpixVerse</Link></h1>
      <nav className={`mx-8`}>
        <ul className={`flex space-x-6 text-2xl`}>
          <LinkedItem href="/" title="Home" icon={<Home size={22} className="-mt-1" />} />
          <LinkedItem href="/projects" title="Projects" icon={<Projector size={22} className="-mt-1" />} />
          <LinkedItem href="/profile" title="Profile" icon={<User size={22} className="-mt-1" />} />
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