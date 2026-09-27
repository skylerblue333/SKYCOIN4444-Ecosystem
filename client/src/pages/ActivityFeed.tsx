import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function ActivityFeed() {
  return <EngineeringBetaWorkspace areaId="social-feed" title="Activity feed" description="Review activity events with clear ownership, ordering, and privacy boundaries." actions={["Filter activity to the relevant account or workspace.", "Check event timestamps before interpreting sequence.", "Avoid exposing private activity through shared or public surfaces."]} />;
}
