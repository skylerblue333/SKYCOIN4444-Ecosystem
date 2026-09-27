import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function BulkUpload() {
  return <EngineeringBetaWorkspace areaId="data-management" title="Bulk upload" description="Prepare validated bulk imports with preview, deduplication, rollback, and error reporting." actions={["Upload a small sample and inspect validation results.", "Keep original files and import outcomes traceable.", "Require rollback or recovery evidence before a large import."]} />;
}
