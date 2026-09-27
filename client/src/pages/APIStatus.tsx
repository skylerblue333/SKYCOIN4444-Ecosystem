import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function APIStatus() {
  return <EngineeringBetaWorkspace areaId="developer-apis" title="API status" description="Review service availability, provider dependencies, and incident boundaries." actions={["Check current status and last update timestamp.", "Identify affected endpoints before retrying requests.", "Use the incident and support path for unresolved failures."]} />;
}
