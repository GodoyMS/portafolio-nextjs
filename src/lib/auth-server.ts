import { auth } from "@/auth";

export async function getAdminSession() {
  const session = await auth();
  if (!session?.user?.role) return null;
  return session;
}

export async function assertAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}
