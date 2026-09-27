import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function Calendar() {
  return <EngineeringBetaWorkspace areaId="events-venues" title="Calendar" description="Plan events and schedules with timezone, ownership, reminder, and cancellation clarity." actions={["Confirm timezone and participant visibility before publishing.", "Keep cancellation and rescheduling behavior visible.", "Do not treat a calendar entry as proof of attendance or payment."]} />;
}
