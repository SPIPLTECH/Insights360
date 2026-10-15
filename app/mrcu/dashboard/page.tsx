import { redirect } from "next/navigation";
import { getCurrentUser, canAccessMrcu } from "@/lib/auth";
import MrcuDashboardClient from "@/components/mrcu/MrcuDashboardClient";

export default function MrcuDashboardPage() {
  const user = getCurrentUser();
  if (!canAccessMrcu(user)) {
    redirect("/login");
  }
  return <MrcuDashboardClient displayName={user.displayName} />;
}
