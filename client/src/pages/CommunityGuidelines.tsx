import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function CommunityGuidelines() {
  return <EngineeringBetaWorkspace areaId="communities" title="Community guidelines" description="Review and publish community expectations with moderation escalation and appeal boundaries." actions={["Write clear prohibited-content and escalation rules.", "Give moderators an auditable appeal and review path.", "Guidelines are not a substitute for active moderation operations."]} />;
}
