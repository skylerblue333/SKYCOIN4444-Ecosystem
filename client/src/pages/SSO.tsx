import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function SSO() {
  return <EngineeringBetaWorkspace areaId="admin-operations" title="SSO" description="This sso surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the sso workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
