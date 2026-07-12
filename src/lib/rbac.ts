import { UserRole, ROLES } from "./constants";

export function checkRole(userRole: string, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole as UserRole);
}

export function assertRole(userRole: string, allowedRoles: UserRole[]): void {
  if (!checkRole(userRole, allowedRoles)) {
    throw new Error("Unauthorized access: Insufficient permissions.");
  }
}

export const rbacConfigs = {
  // Actions allowed for specific roles
  manageConfig: [ROLES.ADMIN] as UserRole[],
  approveParticipations: [ROLES.ADMIN, ROLES.MANAGER] as UserRole[],
  logOperationalData: [ROLES.ADMIN, ROLES.MANAGER] as UserRole[],
  auditGovernance: [ROLES.ADMIN, ROLES.AUDITOR] as UserRole[],
  generalAccess: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.AUDITOR] as UserRole[],
};
