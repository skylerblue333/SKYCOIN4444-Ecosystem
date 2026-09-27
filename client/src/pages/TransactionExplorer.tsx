import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function TransactionExplorer() {
  return <EngineeringBetaWorkspace areaId="admin-operations" title="Transaction Explorer" description="This transaction explorer surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the transaction explorer workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
