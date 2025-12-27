"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Tagline from './Tagline';

const Logo = () => {
  const pathname = usePathname();
  const href = pathname === "/about" ? "/" : "/about";

  return (
    <div className="logo">
      <img src="/9x9.svg" width="50" height="50" />
      <div className="name-and-tagline">
        <a className="navbar-brand mb-0" href={href}>9x9.news</a>
        <small className="text-secondary" style={{ marginTop: "-4px" }}>
          <Tagline />
        </small>
      </div>
    </div>
  );
};

export default Logo;
