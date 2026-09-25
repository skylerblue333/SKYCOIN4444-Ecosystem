import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function SubscriptionSetup() {
  return <EngineeringBetaWorkspace areaId="payments" title="Subscription Setup" description="This subscription setup surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the subscription setup workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
