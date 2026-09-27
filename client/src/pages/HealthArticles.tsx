import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function HealthArticles() {
  return <EngineeringBetaWorkspace areaId="support" title="Health Articles" description="This health articles surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the health articles workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
