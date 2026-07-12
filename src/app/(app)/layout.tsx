import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import AppSidebar from "@/components/shell/app-sidebar";
import AppHeader from "@/components/shell/app-header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      {/* Dynamic Shell Sidebar */}
      <AppSidebar user={user} />

      {/* Main Layout Container */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AppHeader user={user} />
        
        {/* Dynamic content scroll frame */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
