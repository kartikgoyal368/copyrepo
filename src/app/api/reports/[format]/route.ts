import { NextRequest } from "next/server";
import { pdf } from "@react-pdf/renderer";
import React from "react";
import ExcelJS from "exceljs";
import Papa from "papaparse";
import { getCarbonTransactions } from "@/features/environmental/queries";
import { getEmployeeParticipations } from "@/features/social/queries";
import { getComplianceIssues } from "@/features/governance/queries";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#1f2937" },
  header: { borderBottom: "2 solid #059669", paddingBottom: 10, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "bold", color: "#047857" },
  subtitle: { fontSize: 10, color: "#6b7280", marginTop: 4 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", color: "#111827", marginBottom: 8, borderBottom: "1 solid #e5e7eb", paddingBottom: 3 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  label: { color: "#4b5563" },
  value: { fontWeight: "bold" },
});

interface PdfProps {
  emissions: any[];
  social: any[];
  governance: any[];
}

const EsgPdfReport = ({ emissions, social, governance }: PdfProps) => {
  const totalEmissions = emissions.reduce((acc, e) => acc + Number(e.emissionsCalculated || 0), 0);
  const totalHours = social.filter((p) => p.status === "approved").reduce((acc, p) => acc + Number(p.hoursLogged || 0), 0);
  const totalIssues = governance.length;
  const resolvedIssues = governance.filter((i) => i.status === "resolved").length;

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(Text, { style: styles.title }, "EcoSphere ESG Platform Audit Statement"),
        React.createElement(Text, { style: styles.subtitle }, `Generated on: ${new Date().toLocaleDateString()}`)
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "Environmental (E-Index)"),
        React.createElement(
          View,
          { style: styles.row },
          React.createElement(Text, { style: styles.label }, "Total Carbon Emissions Calculated:"),
          React.createElement(Text, { style: styles.value }, `${totalEmissions.toFixed(2)} kg CO2e`)
        ),
        React.createElement(
          View,
          { style: styles.row },
          React.createElement(Text, { style: styles.label }, "Active Logging Transactions:"),
          React.createElement(Text, { style: styles.value }, `${emissions.length} entries`)
        )
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "Social Responsibility (S-Index)"),
        React.createElement(
          View,
          { style: styles.row },
          React.createElement(Text, { style: styles.label }, "Total Community Volunteering:"),
          React.createElement(Text, { style: styles.value }, `${totalHours} hours`)
        ),
        React.createElement(
          View,
          { style: styles.row },
          React.createElement(Text, { style: styles.label }, "CSR Campaign Submissions:"),
          React.createElement(Text, { style: styles.value }, `${social.length} logs`)
        )
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "Corporate Governance (G-Index)"),
        React.createElement(
          View,
          { style: styles.row },
          React.createElement(Text, { style: styles.label }, "Total Compliance Discrepancies:"),
          React.createElement(Text, { style: styles.value }, `${totalIssues} items`)
        ),
        React.createElement(
          View,
          { style: styles.row },
          React.createElement(Text, { style: styles.label }, "Resolved Risks Rate:"),
          React.createElement(
            Text,
            { style: styles.value },
            totalIssues > 0 ? `${Math.round((resolvedIssues / totalIssues) * 100)}%` : "100%"
          )
        )
      )
    )
  );
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ format: string }> }
) {
  const { format } = await params;

  const emissions = await getCarbonTransactions();
  const social = await getEmployeeParticipations();
  const governance = await getComplianceIssues();

  if (format === "csv") {
    const flatData = [
      ...emissions.map((e) => ({
        Module: "Environmental",
        Indicator: "Carbon Emissions",
        Details: e.description || "Activity",
        Metric: `${Number(e.emissionsCalculated || 0).toFixed(2)} kg CO2e`,
        Date: new Date(e.transactionDate).toLocaleDateString(),
      })),
      ...social.map((s) => ({
        Module: "Social",
        Indicator: "Volunteer Hours",
        Details: (s as any).csrActivityTitle || "CSR Campaign",
        Metric: `${s.hoursLogged} hours (${s.status})`,
        Date: new Date(s.createdAt).toLocaleDateString(),
      })),
      ...governance.map((g) => ({
        Module: "Governance",
        Indicator: "Compliance Issue",
        Details: g.title,
        Metric: `${g.severity} severity (${g.status})`,
        Date: new Date(g.dueDate).toLocaleDateString(),
      })),
    ];

    const csvString = Papa.unparse(flatData);

    return new Response(csvString, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=ecosphere_esg_statement.csv",
      },
    });
  }

  if (format === "xlsx") {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "EcoSphere ESG Platform";
    workbook.created = new Date();

    const envSheet = workbook.addWorksheet("Environmental");
    envSheet.columns = [
      { header: "Transaction ID", key: "id", width: 15 },
      { header: "Emission Description", key: "desc", width: 30 },
      { header: "Emissions Calculated (kg CO2e)", key: "emissions", width: 25 },
      { header: "Date", key: "date", width: 15 },
    ];
    emissions.forEach((e) => {
      envSheet.addRow({
        id: e.id,
        desc: e.description || "Activity",
        emissions: Number(e.emissionsCalculated || 0),
        date: new Date(e.transactionDate).toLocaleDateString(),
      });
    });

    const socSheet = workbook.addWorksheet("Social");
    socSheet.columns = [
      { header: "Log ID", key: "id", width: 15 },
      { header: "CSR Activity Name", key: "title", width: 35 },
      { header: "Hours Spent", key: "hours", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Date Logged", key: "date", width: 15 },
    ];
    social.forEach((s) => {
      socSheet.addRow({
        id: s.id,
        title: (s as any).csrActivityTitle || "CSR Activity",
        hours: s.hoursLogged,
        status: s.status,
        date: new Date(s.createdAt).toLocaleDateString(),
      });
    });

    const govSheet = workbook.addWorksheet("Governance");
    govSheet.columns = [
      { header: "Issue ID", key: "id", width: 15 },
      { header: "Issue Title", key: "title", width: 35 },
      { header: "Severity", key: "severity", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Remediation Target", key: "date", width: 15 },
    ];
    governance.forEach((g) => {
      govSheet.addRow({
        id: g.id,
        title: g.title,
        severity: g.severity,
        status: g.status,
        date: new Date(g.dueDate).toLocaleDateString(),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer as any, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=ecosphere_esg_statement.xlsx",
      },
    });
  }

  if (format === "pdf") {
    const doc = React.createElement(EsgPdfReport, { emissions, social, governance });
    const buffer = await pdf(doc).toBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=ecosphere_esg_statement.pdf",
      },
    });
  }

  return new Response("Invalid download format.", { status: 400 });
}
