import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import MrcuDashboardClient from "@/components/mrcu/MrcuDashboardClient";

export default function MrcuDashboardPage() {
  const user = getCurrentUser();
  if (!user || user.role !== "mrcu") {
    redirect("/mrcu/login");
  }
  return <MrcuDashboardClient displayName={user!.displayName} />;
}
