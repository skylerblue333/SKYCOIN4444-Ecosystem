import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function BridgeTransactions() {
  return <EngineeringBetaWorkspace areaId="cross-chain" title="Bridge transactions" description="Review cross-chain transfer requirements without implying custody or settlement is available." actions={["Confirm source and destination networks before any action.", "Treat fees, finality, and bridge status as provisional until verified.", "Use test funds and independent review until the security gate passes."]} />;
}
