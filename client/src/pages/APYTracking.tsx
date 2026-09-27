import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function APYTracking() {
  return <EngineeringBetaWorkspace areaId="staking" title="APY tracking" description="Review yield estimates with source, time window, volatility, and risk context." actions={["Confirm the source and calculation period for every estimate.", "Separate historical performance from future expectations.", "Do not treat displayed APY as a promise or recommendation."]} />;
}
