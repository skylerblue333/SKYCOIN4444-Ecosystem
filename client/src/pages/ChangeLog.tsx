import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function ChangeLog() {
  return <EngineeringBetaWorkspace areaId="observability" title="Change Log" description="This change log surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the change log workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
