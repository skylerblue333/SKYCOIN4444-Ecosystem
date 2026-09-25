import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function SDKDownload() {
  return <EngineeringBetaWorkspace areaId="sdk-integrations" title="SDKDownload" description="This sdkdownload surface is available as an engineering-beta workspace with explicit scope, readiness, and next actions." actions={["Review the sdkdownload workflow and its current supported scope.", "Validate ownership, permissions, and failure handling before using it with real data.", "Use the readiness panel to track evidence, testing, and the next release gate."]} />;
}
