"use server";

import { signOut } from "@/auth";

export async function adminSignOut() {
  await signOut({ redirectTo: "/admin/login" });
}
