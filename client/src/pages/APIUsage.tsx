import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function APIUsage() {
  return <EngineeringBetaWorkspace areaId="developer-apis" title="API usage" description="Inspect usage, limits, and integration health with clear beta boundaries." actions={["Identify the owner and expected budget for each integration.", "Use rate limits and retries that respect provider contracts.", "Usage dashboards are not billing or settlement evidence."]} />;
}
