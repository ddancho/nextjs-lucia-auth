import styles from "@/app/(verifyEmail)/verify-email-error/page.module.css";

export default async function VerifyErrorPage() {
  // TODO
  // resend email

  return (
    <main className={styles.main}>
      <h1>Email verify error!</h1>
      <p>Try again later, or click resend email button (TODO)</p>
    </main>
  );
}
