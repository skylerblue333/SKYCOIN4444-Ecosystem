import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function CCPA() {
  return <EngineeringBetaWorkspace areaId="privacy" title="Privacy rights" description="Review privacy-request workflows, data scope, retention, and response ownership." actions={["Identify the requester and data scope through an approved process.", "Record intake, verification, fulfillment, and deletion evidence.", "Do not treat this workspace as legal advice or certification."]} />;
}
