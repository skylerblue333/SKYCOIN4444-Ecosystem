import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function TierComparison() {
  return <EngineeringBetaWorkspace areaId="admin-operations" title="Tier Comparison" description="This tier comparison surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the tier comparison workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
