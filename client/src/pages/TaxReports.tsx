import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function TaxReports() {
  return <EngineeringBetaWorkspace areaId="analytics" title="Tax Reports" description="This tax reports surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the tax reports workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
