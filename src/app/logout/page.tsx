import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import validateRequest from "@/util/auth";

export default async function LogoutPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  const LogoutForm = dynamic(() => import("@/components/LogoutForm"), {
    ssr: false,
  });

  return (
    <>
      <LogoutForm />
    </>
  );
}
