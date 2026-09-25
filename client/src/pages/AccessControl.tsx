import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function AccessControl() {
  return <EngineeringBetaWorkspace areaId="access-security" title="Access control" description="Review roles, permissions, ownership, and least-privilege boundaries before granting access." actions={["Map each role to the minimum required capability.", "Review inherited access and remove stale permissions.", "Keep privileged changes attributable through an audit trail."]} />;
}
