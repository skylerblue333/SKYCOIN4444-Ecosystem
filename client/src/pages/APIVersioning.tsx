import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function APIVersioning() {
  return <EngineeringBetaWorkspace areaId="developer-apis" title="API versioning" description="Plan compatible API evolution with deprecation, migration, and rollback evidence." actions={["Document breaking changes and migration steps.", "Keep old and new contracts testable during transition.", "Publish a deprecation owner and support window."]} />;
}
