import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function FeedWithPosts() {
  return <EngineeringBetaWorkspace areaId="admin-operations" title="Feed With Posts" description="This feed with posts surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the feed with posts workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
