import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function AudioAnalytics() {
  return <EngineeringBetaWorkspace areaId="audio-voice" title="Audio analytics" description="Review audio usage and quality metrics with explicit sampling and retention boundaries." actions={["Define the metric and time window before interpreting results.", "Check data freshness and consent coverage.", "Do not infer identity or sensitive traits from incomplete audio metrics."]} />;
}
