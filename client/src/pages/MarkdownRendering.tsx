import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function MarkdownRendering() {
  return <EngineeringBetaWorkspace areaId="admin-operations" title="Markdown Rendering" description="This markdown rendering surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the markdown rendering workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
