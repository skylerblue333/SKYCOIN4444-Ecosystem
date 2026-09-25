import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function EmailTemplates() {
  return <EngineeringBetaWorkspace areaId="ai-assistants" title="Email Templates" description="This email templates surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the email templates workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
