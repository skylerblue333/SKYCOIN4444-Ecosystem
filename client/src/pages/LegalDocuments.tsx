import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function LegalDocuments() {
  return <EngineeringBetaWorkspace areaId="compliance" title="Legal Documents" description="This legal documents surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the legal documents workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
