import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function MultivariateTesting() {
  return <EngineeringBetaWorkspace areaId="admin-operations" title="Multivariate Testing" description="This multivariate testing surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the multivariate testing workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
