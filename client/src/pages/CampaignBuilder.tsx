import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function CampaignBuilder() {
  return <EngineeringBetaWorkspace areaId="marketing-growth" title="Campaign builder" description="Design campaigns with audience consent, budget controls, attribution, and rollback criteria." actions={["Define audience eligibility and exclusion rules.", "Set budget, frequency, and stop conditions.", "Review attribution data before making growth claims."]} />;
}
