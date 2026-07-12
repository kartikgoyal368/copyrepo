"use client";

import { useState } from "react";
import PageShell from "@/components/shell/page-shell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import GovernanceKPIsPanel from "./governance-kpis";
import GovernanceScoreCard from "./governance-score-card";
import ComplianceChart from "./compliance-chart";
import AuditRiskChart from "./audit-risk-chart";
import PolicyTable from "./policy-table";
import PolicyForm from "./policy-form";
import ComplianceIssueTable from "./compliance-issue-table";
import ComplianceIssueForm from "./compliance-issue-form";
import AuditForm from "./audit-form";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldAlert, FileText, CheckCircle2, ClipboardList } from "lucide-react";
import { EsgPolicy, Audit, ComplianceIssue } from "../types";

interface GovernanceShellProps {
  policies: EsgPolicy[];
  audits: Audit[];
  issues: ComplianceIssue[];
  users: { id: string; name: string | null; email: string }[];
  currentUser: { id: string; name: string | null; email: string; role: string };
}

export default function GovernanceShell({
  policies,
  audits,
  issues,
  users,
  currentUser,
}: GovernanceShellProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [localPolicies, setLocalPolicies] = useState<EsgPolicy[]>(policies);
  const [localAudits, setLocalAudits] = useState<Audit[]>(audits);
  const [localIssues, setLocalIssues] = useState<ComplianceIssue[]>(issues);

  const isAuthorized = currentUser.role === "admin" || currentUser.role === "manager" || currentUser.role === "auditor";

  return (
    <PageShell
      title="Governance, Risk & Compliance"
      description="Monitor corporate ESG policies, acknowledgements, risk vectors, internal/external audits, and open compliance issues."
    >
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* KPI Panel and Tabs (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          <GovernanceKPIsPanel issues={localIssues} audits={localAudits} policies={localPolicies} />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="overview">Risk Analytics</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
              <TabsTrigger value="issues">Compliance Log</TabsTrigger>
              <TabsTrigger value="audits">Audits</TabsTrigger>
            </TabsList>

            {/* Risk Analytics Overview */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <ComplianceChart issues={localIssues} />
                <AuditRiskChart audits={localAudits} />
              </div>
            </TabsContent>

            {/* Policies */}
            <TabsContent value="policies" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                    Active ESG Policy Registry
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Corporate directives mapping environmental, social and compliance expectations.
                  </p>
                </div>
                {(currentUser.role === "admin" || currentUser.role === "manager") && (
                  <PolicyForm
                    onSuccess={(newPolicy) => {
                      setLocalPolicies((prev) => [newPolicy, ...prev]);
                    }}
                  />
                )}
              </div>
              <PolicyTable policies={localPolicies} />
            </TabsContent>

            {/* Compliance Issues Log */}
            <TabsContent value="issues" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                    Risk Assessment & Issues Ledger
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Open compliance discrepancies, owner assignments, and regulatory remediation actions.
                  </p>
                </div>
                {isAuthorized && (
                  <ComplianceIssueForm
                    users={users}
                    onSuccess={(newIssue) => {
                      setLocalIssues((prev) => [newIssue, ...prev]);
                    }}
                  />
                )}
              </div>
              <ComplianceIssueTable
                issues={localIssues}
                currentUser={currentUser}
                onResolve={(issueId) => {
                  setLocalIssues((prev) =>
                    prev.map((i) =>
                      i.id === issueId
                        ? { ...i, status: "resolved", resolvedAt: new Date(), resolvedById: currentUser.id }
                        : i
                    )
                  );
                }}
              />
            </TabsContent>

            {/* Audits History */}
            <TabsContent value="audits" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                    Internal & External Audits History
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Disclosed reports, scores, and findings completed by certified ESG auditors.
                  </p>
                </div>
                {(currentUser.role === "admin" || currentUser.role === "auditor") && (
                  <AuditForm
                    onSuccess={(newAudit) => {
                      setLocalAudits((prev) => [newAudit, ...prev]);
                    }}
                  />
                )}
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Audit Title</TableHead>
                    <TableHead>Auditor</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Findings</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localAudits.map((aud) => (
                    <TableRow key={aud.id}>
                      <TableCell className="font-bold text-neutral-850 dark:text-neutral-200">
                        {aud.title}
                      </TableCell>
                      <TableCell className="text-neutral-500">{aud.auditorName}</TableCell>
                      <TableCell className="text-neutral-600 dark:text-neutral-350 max-w-[200px] truncate">
                        {aud.scope}
                      </TableCell>
                      <TableCell className="font-mono text-rose-500 font-bold">
                        {aud.findingsCount} issues
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-200/50">
                          {aud.rating || "PENDING"}
                        </span>
                      </TableCell>
                      <TableCell className="text-neutral-400">
                        {new Date(aud.auditDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>

        {/* Scoring Card (3 cols) */}
        <div className="lg:col-span-3">
          <GovernanceScoreCard issues={localIssues} audits={localAudits} />
        </div>
      </div>
    </PageShell>
  );
}
