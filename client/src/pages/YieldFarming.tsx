import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function YieldFarming() {
  return <EngineeringBetaWorkspace areaId="staking" title="Yield Farming" description="This yield farming surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the yield farming workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
