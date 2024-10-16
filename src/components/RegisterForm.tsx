"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSignUp, UserSignUpSchema } from "@/types";
import { register as registerUser } from "@/actions/auth";
import { useRouter } from "next/navigation";
import styles from "@/components/registerForm.module.css";
import toast from "react-hot-toast";

function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserSignUp>({
    resolver: zodResolver(UserSignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = async (signUpData: UserSignUp) => {
    const { status } = await registerUser(signUpData);
    if (status === "error") {
      toast.error("SignUp failed. Try again later.");
      reset();
      return;
    }

    toast.success("You are successfully signed up. Go and sign in.");
    router.push("/login");
    reset();
  };

  return (
    <>
      <h1 className={styles.title}>Sign up</h1>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <input
          {...register("username")}
          type="text"
          placeholder="Enter your name"
        />
        {errors.username && (
          <p className={styles.inputError}>{`${errors.username.message}`}</p>
        )}
        <input
          {...register("email")}
          type="email"
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className={styles.inputError}>{`${errors.email.message}`}</p>
        )}
        <input
          {...register("password")}
          type="password"
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className={styles.inputError}>{`${errors.password.message}`}</p>
        )}
        <input
          {...register("passwordConfirm")}
          type="password"
          placeholder="Confirm your password"
        />
        {errors.passwordConfirm && (
          <p
            className={styles.inputError}
          >{`${errors.passwordConfirm.message}`}</p>
        )}

        <div className={styles.signup}>
          <button type="submit" disabled={isSubmitting}>
            Sign Up
          </button>
        </div>
      </form>
    </>
  );
}

export default RegisterForm;
