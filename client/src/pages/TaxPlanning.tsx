import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function TaxPlanning() {
  return <EngineeringBetaWorkspace areaId="compliance" title="Tax Planning" description="This tax planning surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the tax planning workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
