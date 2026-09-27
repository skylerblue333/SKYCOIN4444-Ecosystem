import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function EventCalendar() {
  return <EngineeringBetaWorkspace areaId="events-venues" title="Event Calendar" description="This event calendar surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the event calendar workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
