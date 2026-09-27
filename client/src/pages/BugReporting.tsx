import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function BugReporting() {
  return <EngineeringBetaWorkspace areaId="support" title="Bug reporting" description="Capture reproducible reports with severity, environment, evidence, and customer impact." actions={["Include steps to reproduce and expected behavior.", "Remove secrets and personal data from attachments.", "Track owner, severity, status, and release verification."]} />;
}
