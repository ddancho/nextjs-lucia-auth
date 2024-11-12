import styles from "@/app/(verifyEmail)/verify-email-success/page.module.css";

export default async function VerifySuccessPage() {
  return (
    <main className={styles.main}>
      <h1>Email verify success!</h1>
      <p>You can login now</p>
    </main>
  );
}
