import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function CodeSamples() {
  return <EngineeringBetaWorkspace areaId="ai-coding" title="Code Samples" description="This code samples surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the code samples workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
