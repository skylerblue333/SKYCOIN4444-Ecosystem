import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function TravelBlog() {
  return <EngineeringBetaWorkspace areaId="travel-lifestyle" title="Travel Blog" description="This travel blog surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the travel blog workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
