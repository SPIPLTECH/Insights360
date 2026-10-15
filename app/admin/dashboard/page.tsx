import { redirect } from "next/navigation";
import { getCurrentUser, canAccessAdmin, homePathForRole } from "@/lib/auth";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  const user = getCurrentUser();
  if (!user) redirect("/login");
  if (!canAccessAdmin(user)) redirect(homePathForRole(user.role)); // MRCU / DCU go to their own dashboard
  return <AdminDashboardClient displayName={user.displayName} />;
}
