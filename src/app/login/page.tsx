import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import validateRequest from "@/util/auth";

export default async function LoginPage() {
  const { user } = await validateRequest();

  if (user) {
    redirect("/");
  }

  const LoginForm = dynamic(() => import("@/components/LoginForm"), {
    ssr: false,
  });

  return (
    <>
      <LoginForm />
    </>
  );
}
