import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function KnowledgeBase() {
  return <EngineeringBetaWorkspace areaId="admin-operations" title="Knowledge Base" description="This knowledge base surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the knowledge base workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
