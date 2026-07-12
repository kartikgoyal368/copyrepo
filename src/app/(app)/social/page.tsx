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
  const activities = await getCsrActivities();
  const participations = await getEmployeeParticipations();
  const diversity = await getDiversityMetrics();
  const training = await getTrainingCompletions();

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
