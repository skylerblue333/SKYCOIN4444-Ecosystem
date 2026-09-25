import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function ABTesting() {
  return <EngineeringBetaWorkspace areaId="marketing-growth" title="A/B testing" description="Design experiments with explicit hypotheses, cohorts, guardrails, and rollback criteria." actions={["Define a measurable hypothesis before launching an experiment.", "Keep audience exposure and stop conditions visible.", "Do not treat preview metrics as causal production evidence."]} />;
}
