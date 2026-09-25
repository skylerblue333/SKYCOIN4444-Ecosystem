import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function TermsOfService() {
  return <EngineeringBetaWorkspace areaId="admin-operations" title="Terms Of Service" description="This terms of service surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the terms of service workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
