import { EmployeeParticipation } from "../types";

export function evaluateEvidenceStrength(participation: EmployeeParticipation): "strong" | "weak" | "none" {
  if (!participation.proofUrl) return "none";
  
  // Strong evidence requires standard secure uploads through designated uploadthing domain
  if (participation.proofUrl.startsWith("https://utfs.io/")) {
    return "strong";
  }
  
  if (participation.proofUrl.startsWith("http://") || participation.proofUrl.startsWith("https://")) {
    return "weak";
  }
  
  return "none";
}
