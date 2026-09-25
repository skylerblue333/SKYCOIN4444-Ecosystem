import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function BlockRewards() {
  return <EngineeringBetaWorkspace areaId="blockchain-core" title="Block Rewards" description="This block rewards surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the block rewards workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
