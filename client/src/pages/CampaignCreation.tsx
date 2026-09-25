import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function CampaignCreation() {
  return <EngineeringBetaWorkspace areaId="ai-assistants" title="Campaign Creation" description="This campaign creation surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the campaign creation workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
