import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function AgentPerformance() {
  return <EngineeringBetaWorkspace areaId="ai-agents" title="Agent performance" description="Evaluate agent behavior with task success, latency, cost, and safety evidence." actions={["Define success criteria before comparing agents.", "Review failed and unsafe outputs, not only completion rate.", "Set spend, tool, and permission limits before broader use."]} />;
}
