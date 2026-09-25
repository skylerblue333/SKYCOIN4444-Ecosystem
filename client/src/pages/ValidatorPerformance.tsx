import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function ValidatorPerformance() {
  return <EngineeringBetaWorkspace areaId="blockchain-core" title="Validator Performance" description="This validator performance surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the validator performance workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
