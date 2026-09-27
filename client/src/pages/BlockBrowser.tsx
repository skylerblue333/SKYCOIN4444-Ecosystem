import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function BlockBrowser() {
  return <EngineeringBetaWorkspace areaId="blockchain-core" title="Block Browser" description="This block browser surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the block browser workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
