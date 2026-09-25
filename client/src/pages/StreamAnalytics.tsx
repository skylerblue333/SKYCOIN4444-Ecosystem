import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function StreamAnalytics() {
  return <EngineeringBetaWorkspace areaId="live-streaming" title="Stream Analytics" description="This stream analytics surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the stream analytics workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
