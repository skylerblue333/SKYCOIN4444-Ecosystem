import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function ChainExplorer() {
  return <EngineeringBetaWorkspace areaId="chain-explorer" title="Chain explorer" description="Review chain activity with explicit source, freshness, and finality boundaries." actions={["Check network, block height, and timestamp before interpreting activity.", "Treat unconfirmed activity as provisional.", "Explorer views do not prove custody, settlement, or investment value."]} />;
}
