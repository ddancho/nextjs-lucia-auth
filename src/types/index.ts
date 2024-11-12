import { z } from "zod";
import type { Session, User } from "lucia";
import Mail from "nodemailer/lib/mailer";

export const UserSignUpSchema = z
  .object({
    username: z.string().trim().min(1, "Name is required"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Email is required")
      .email({ message: "Email is not valid" }),
    password: z
      .string()
      .trim()
      .min(6, "Password is required")
      .max(100, "Password is too long"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords must match",
    path: ["passwordConfirm"],
  });

export type UserSignUp = z.infer<typeof UserSignUpSchema>;

export const UserSignInSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email({ message: "Email is not valid" }),
  password: z.string().trim().min(1, "Password is required"),
});

export type UserSignIn = z.infer<typeof UserSignInSchema>;

export type Status = "success" | "error";

export type ServerResponse = {
  status: Status;
  message?: string;
};

export type SessionData = {
  user: User | null;
  session: Session | null;
};

export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  logout: "/logout",
} as const;

export type Routes = (typeof routes)[keyof typeof routes];

export type SendEmailInfo = Required<
  Pick<Mail.Options, "from" | "to" | "subject" | "text" | "html">
>;
