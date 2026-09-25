import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function APIIntegration() {
  return <EngineeringBetaWorkspace areaId="developer-apis" title="APIIntegration" description="This apiintegration surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the apiintegration workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
