import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function TaskAutomation() {
  return <EngineeringBetaWorkspace areaId="workflow-automation" title="Task Automation" description="This task automation surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the task automation workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
