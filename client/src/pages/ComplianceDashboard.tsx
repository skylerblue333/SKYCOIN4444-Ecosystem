import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function ComplianceDashboard() {
  return <EngineeringBetaWorkspace areaId="compliance" title="Compliance dashboard" description="Track compliance work, evidence owners, and review status without claiming legal certification." actions={["Assign an owner and due date to every control.", "Attach evidence and record exceptions explicitly.", "This workspace does not provide legal advice or certification."]} />;
}
