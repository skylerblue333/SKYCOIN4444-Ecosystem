import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function AdvancedSearch() {
  return <EngineeringBetaWorkspace areaId="search-discovery" title="Advanced search" description="Define search intent, filters, freshness, and relevance expectations before relying on discovery results." actions={["Start with a precise query and inspect the returned scope.", "Check freshness and ranking context before making decisions.", "Report missing or unsafe results through the support and moderation paths."]} />;
}
