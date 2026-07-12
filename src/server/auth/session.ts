import { auth } from "../../../auth";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ? {
    id: (session.user as any).id as string,
    name: session.user.name,
    email: session.user.email,
    role: (session.user as any).role as string,
    departmentId: (session.user as any).departmentId as number | null,
  } : null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: Access denied.");
  }
  return user;
}
