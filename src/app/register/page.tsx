import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import validateRequest from "@/util/auth";

export default async function RegisterPage() {
  const { user } = await validateRequest();

  if (user) {
    redirect("/");
  }

  const RegisterForm = dynamic(() => import("@/components/RegisterForm"), {
    ssr: false,
  });

  return (
    <>
      <RegisterForm />
    </>
  );
}
