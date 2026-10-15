import { redirect } from "next/navigation";
import { getCurrentUser, homePathForRole } from "@/lib/auth";
import LoginForm from "@/components/auth/LoginForm";

export const dynamic = "force-dynamic";

/** One login for DCU, MRCU and Admin. The role is stored in the database — nobody picks it here. */
export default function LoginPage() {
  const user = getCurrentUser();
  if (user) redirect(homePathForRole(user.role));
  return <LoginForm />;
}
