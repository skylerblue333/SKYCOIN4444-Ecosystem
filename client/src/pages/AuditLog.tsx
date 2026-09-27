import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function AuditLog() {
  return <EngineeringBetaWorkspace areaId="compliance" title="Audit log" description="Review auditable events with actor, timestamp, scope, and retention context." actions={["Filter events by actor, resource, and time window.", "Record exceptions instead of silently suppressing them.", "Treat this view as evidence support, not legal certification."]} />;
}
