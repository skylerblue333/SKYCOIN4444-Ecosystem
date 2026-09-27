import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function VendorPerformance() {
  return <EngineeringBetaWorkspace areaId="enterprise-crm" title="Vendor Performance" description="This vendor performance surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the vendor performance workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
