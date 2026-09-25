import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function StockSearch() {
  return <EngineeringBetaWorkspace areaId="search-discovery" title="Stock Search" description="This stock search surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the stock search workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
