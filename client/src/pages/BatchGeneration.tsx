import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function BatchGeneration() {
  return <EngineeringBetaWorkspace areaId="ai-content" title="Batch generation" description="Plan batch content generation with input validation, cost limits, and review checkpoints." actions={["Validate a small sample before scaling a batch.", "Set output, cost, and rate limits before running.", "Review generated content for accuracy, rights, and safety."]} />;
}
