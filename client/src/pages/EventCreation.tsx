import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function EventCreation() {
  return <EngineeringBetaWorkspace areaId="events-venues" title="Event Creation" description="This event creation surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the event creation workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
