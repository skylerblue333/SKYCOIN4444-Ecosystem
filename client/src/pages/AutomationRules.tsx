import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function AutomationRules() {
  return <EngineeringBetaWorkspace areaId="workflow-automation" title="Automation rules" description="Define triggers, conditions, actions, and recovery behavior before enabling an automation." actions={["Write a test scenario and expected result first.", "Set rate limits, retries, and stop conditions.", "Review execution history before trusting an automated action."]} />;
}
