import validateRequest from "@/util/auth";
import styles from "@/app/page.module.css";

export default async function Home() {
  const { user } = await validateRequest();

  return (
    <main className={styles.main}>
      {user && <p>Hello {user.username}</p>}
      {!user && <p>I don&apos;t know you!</p>}
    </main>
  );
}
