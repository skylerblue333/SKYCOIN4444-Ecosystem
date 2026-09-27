import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function MailingLists() {
  return <EngineeringBetaWorkspace areaId="ai-assistants" title="Mailing Lists" description="This mailing lists surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the mailing lists workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
