import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function ApprovalWorkflows() {
  return <EngineeringBetaWorkspace areaId="workflow-automation" title="Approval Workflows" description="This approval workflows surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the approval workflows workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
