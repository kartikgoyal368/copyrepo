import { requireUser } from "@/server/auth/session";
import { getSettings, getDepartments } from "@/features/settings/queries";
import SettingsShell from "@/features/settings/components/settings-shell";

export default async function SettingsPage() {
  const user = await requireUser();
  const settings = await getSettings();
  const departments = await getDepartments();

  const currentUser = {
    role: user.role,
  };

  return (
    <SettingsShell
      settings={settings}
      departments={departments}
      currentUser={currentUser}
    />
  );
}
