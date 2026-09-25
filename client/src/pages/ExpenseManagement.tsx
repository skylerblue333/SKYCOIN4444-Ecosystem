import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function ExpenseManagement() {
  return <EngineeringBetaWorkspace areaId="admin-operations" title="Expense Management" description="This expense management surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the expense management workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
