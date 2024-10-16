"use client";

import { useForm } from "react-hook-form";
import { logout as logoutUser } from "@/actions/auth";
import { useRouter } from "next/navigation";
import styles from "@/components/logoutForm.module.css";
import toast from "react-hot-toast";

function LogoutForm() {
  const router = useRouter();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async () => {
    const { status, message } = await logoutUser();
    if (status === "error") {
      toast.error(message!);
      return;
    }

    toast.success("You are successfully logged out");
    router.push("/");
  };

  return (
    <>
      <h1 className={styles.title}>Logout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.signup}>
          <button type="submit" disabled={isSubmitting}>
            Logout
          </button>
        </div>
      </form>
    </>
  );
}

export default LogoutForm;
