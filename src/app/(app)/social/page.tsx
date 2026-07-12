import { requireUser } from "@/server/auth/session";
import {
  getCsrActivities,
  getEmployeeParticipations,
  getDiversityMetrics,
  getTrainingCompletions,
} from "@/features/social/queries";
import SocialShell from "@/features/social/components/social-shell";

export default async function SocialPage() {
  const user = await requireUser();
  const [activities, participations, diversity, training] = await Promise.all([
    getCsrActivities(),
    getEmployeeParticipations(),
    getDiversityMetrics(),
    getTrainingCompletions(),
  ]);

  const currentUser = {
    id: user.id,
    name: user.name || null,
    email: user.email || "",
    role: user.role,
  };

  return (
    <SocialShell
      activities={activities}
      participations={participations}
      diversity={diversity}
      training={training}
      currentUser={currentUser}
    />
  );
}
