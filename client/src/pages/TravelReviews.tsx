import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function TravelReviews() {
  return <EngineeringBetaWorkspace areaId="travel-lifestyle" title="Travel Reviews" description="This travel reviews surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the travel reviews workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
