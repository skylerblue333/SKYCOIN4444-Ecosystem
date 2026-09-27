import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function ABTestingAdvanced() {
  return <EngineeringBetaWorkspace areaId="admin-operations" title="ABTesting Advanced" description="This abtesting advanced surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the abtesting advanced workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
