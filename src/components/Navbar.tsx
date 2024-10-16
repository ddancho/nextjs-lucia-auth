import validateRequest from "@/util/auth";
import styles from "@/components/navbar.module.css";
import Link from "next/link";
import NavbarLink from "@/components/NavbarLink";

async function Navbar() {
  const { user } = await validateRequest();

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.link}>
        Home
      </Link>

      <NavbarLink url="/login" user={user}>
        Sign In
      </NavbarLink>

      <NavbarLink url="/register" user={user}>
        Sign Up
      </NavbarLink>

      <NavbarLink url="/logout" user={user}>
        Logout
      </NavbarLink>
    </div>
  );
}

export default Navbar;
