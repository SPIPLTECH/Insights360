import { redirect } from "next/navigation";

// Single login for everyone — see /login
export default function LegacyLoginRedirect() {
  redirect("/login");
}
