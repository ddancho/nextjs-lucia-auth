"use client";

import { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import styles from "@/components/navbarLink.module.css";
import type { Routes } from "@/types";
import type { User } from "lucia";

type NavbarLinkProps = {
  children: ReactNode;
  url: Routes;
  user: User | null;
};

function NavbarLink({ children, url, user }: NavbarLinkProps) {
  const props: CSSProperties = {
    pointerEvents: "none",
  };

  if (url === "/logout") {
    props.pointerEvents = user ? "auto" : "none";
    props.opacity = user ? 1 : 0.5;
  } else {
    props.pointerEvents = !user ? "auto" : "none";
    props.opacity = !user ? 1 : 0.5;
  }

  return (
    <Link
      href={url}
      className={styles.link}
      style={props}
      onClick={(e) => {
        if (props.pointerEvents === "none") {
          e.preventDefault();
          return;
        }
      }}
    >
      {children}
    </Link>
  );
}

export default NavbarLink;
