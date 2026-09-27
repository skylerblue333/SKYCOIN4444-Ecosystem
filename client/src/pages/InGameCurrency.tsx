import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function InGameCurrency() {
  return <EngineeringBetaWorkspace areaId="games-arcade" title="In Game Currency" description="This in game currency surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the in game currency workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
