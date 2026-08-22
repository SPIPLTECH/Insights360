import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DcuDashboardClient from "@/components/dcu/DcuDashboardClient";

export default function DcuDashboardPage() {
  const user = getCurrentUser();
  if (!user || user.role !== "dcu" || !user.district) {
    redirect("/dcu/login");
  }
  return <DcuDashboardClient district={user!.district!} displayName={user!.displayName} />;
}
