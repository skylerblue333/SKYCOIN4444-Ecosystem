import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function AnalyticsReports() {
  return <EngineeringBetaWorkspace areaId="analytics" title="Analytics reports" description="Build reports from defined metrics and known data freshness rather than implying complete business truth." actions={["Define the metric owner and time window before interpreting results.", "Check data freshness and sample size before acting.", "Do not use incomplete beta data for financial or compliance attestations."]} />;
}
