import { EngineeringBetaWorkspace } from "@/components/EngineeringBetaWorkspace";

export default function BackupManagement() {
  return <EngineeringBetaWorkspace areaId="backup-recovery" title="Backup management" description="Plan backup coverage, retention, restore testing, and recovery ownership." actions={["Identify critical data and its recovery objective.", "Run restore drills before calling a backup reliable.", "A backup that has not been restored is unverified."]} />;
}
