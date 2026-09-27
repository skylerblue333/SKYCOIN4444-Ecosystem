import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function APIDocumentation() {
  return <EngineeringBetaWorkspace areaId="developer-apis" title="API documentation" description="Explore API contracts, authentication boundaries, examples, and versioning expectations." actions={["Review endpoint inputs and outputs before integration.", "Keep keys and sensitive payloads out of examples.", "Version changes require compatibility and release evidence."]} />;
}
