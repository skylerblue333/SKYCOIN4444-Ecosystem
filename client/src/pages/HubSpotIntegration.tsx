import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function HubSpotIntegration() {
  return <EngineeringBetaWorkspace areaId="admin-operations" title="Hub Spot Integration" description="This hub spot integration surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the hub spot integration workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
