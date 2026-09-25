import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function MobileSearch() {
  return <EngineeringBetaWorkspace areaId="search-discovery" title="Mobile Search" description="This mobile search surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the mobile search workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
