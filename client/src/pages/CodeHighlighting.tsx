import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function CodeHighlighting() {
  return <EngineeringBetaWorkspace areaId="ai-coding" title="Code Highlighting" description="This code highlighting surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the code highlighting workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
